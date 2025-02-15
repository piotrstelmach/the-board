import { ErrorResponse, TypedRequestBody } from '../types/global';
import {
  LoginUserInput,
  RegisterUserInput,
} from '../types/http/authentication.http';
import { Response, Request } from 'express';
import * as authService from '../services/authentication.service';
import { AuthUserResult } from '../services/authentication.service';
import jwt from 'jsonwebtoken';
import {
  getJwtExpiration,
  getJwtSecret,
  getRefreshTokenSecret,
} from '../config/jwt';

interface TokenPayload {
  user_id: number;
}

type TokenResponse = {
  accessToken: string;
};

export class AuthenticationController {
  async registerUser(
    req: TypedRequestBody<RegisterUserInput>,
    res: Response<(AuthUserResult & TokenResponse) | ErrorResponse>
  ) {
    try {
      const user: AuthUserResult | undefined =
        await authService.registerNewUser(req.body);
      if (user) {
        const payload: TokenPayload = { user_id: user.id };
        const accessToken: string = jwt.sign(payload, getJwtSecret(), {
          expiresIn: getJwtExpiration(),
        });
        const refreshToken: string = jwt.sign(
          payload,
          getRefreshTokenSecret(),
          { expiresIn: '7d' }
        );

        return res
          .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          })
          .status(200)
          .json({ accessToken, ...user });
      }
    } catch (e) {
      if (e instanceof Error) {
        return res.status(400).json({ error: e.message });
      }
    }
  }

  async loginUser(
    req: TypedRequestBody<LoginUserInput>,
    res: Response<(AuthUserResult & TokenResponse) | ErrorResponse>
  ) {
    try {
      const user: AuthUserResult | undefined = await authService.loginUser(
        req.body
      );
      if (user) {
        const payload: TokenPayload = { user_id: user.id };
        const accessToken: string = jwt.sign(payload, getJwtSecret(), {
          expiresIn: getJwtExpiration(),
        });
        const refreshToken: string = jwt.sign(
          payload,
          getRefreshTokenSecret(),
          { expiresIn: '7d' }
        );

        return res
          .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          })
          .status(200)
          .json({ ...user, accessToken });
      }
    } catch (e) {
      if (e instanceof Error) {
        return res.status(400).json({ error: e.message });
      }
    }
  }

  async logoutUser(_req: Request, res: Response) {
    try {
      res.clearCookie('refreshToken').status(200).send();
    } catch (e) {
      if (e instanceof Error) {
        return res.status(400).json({ error: e.message });
      }
    }
  }

  async refreshToken(
    req: Request,
    res: Response<TokenResponse | ErrorResponse>
  ) {
    try {
      const refreshToken = req.cookies['refreshToken'];
      if (!refreshToken) {
        return res.status(400).json({ error: 'No refresh token provided' });
      }
      const decoded = jwt.verify(
        refreshToken,
        getRefreshTokenSecret()
      ) as TokenPayload;

      const newPayload: TokenPayload = { user_id: decoded.user_id };
      const newAccessToken = jwt.sign(newPayload, getJwtSecret(), {
        expiresIn: getJwtExpiration(),
      });
      const newRefreshToken = jwt.sign(newPayload, getRefreshTokenSecret(), {
        expiresIn: '7d',
      });

      return res
        .cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })
        .status(200)
        .json({ accessToken: newAccessToken });
    } catch (e) {
      if (e instanceof Error) {
        return res.status(400).json({ error: e.message });
      }
    }
  }
}
