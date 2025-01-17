import { ErrorResponse, TypedRequestBody } from '../types/global';
import { LoginUserInput, RegisterUserInput } from '../types/http/authentication.http';
import { Response, Request } from 'express';
import * as authService from '../services/authentication.service';
import { AuthUserResult } from '../services/authentication.service';

export class AuthenticationController {
  async registerUser(req: TypedRequestBody<RegisterUserInput>, res: Response<AuthUserResult | ErrorResponse>)  {
    try {
      const user = await authService.registerNewUser(req.body);
        res.status(200).send(user);
    } catch (e) {
      if(e instanceof Error) {
        res.status(400).send({ error: e.message });
      }
    }
  }

  async loginUser(req: TypedRequestBody<LoginUserInput>, res: Response<AuthUserResult | ErrorResponse>) {
    try {
      const user = await authService.loginUser(req.body);
      res.status(200).send(user);
    } catch (e) {
      if (e instanceof Error) {
        res.status(400).send({ error: e.message });
      }

    }
  }

  async logoutUser(req: Request, res: Response) {
    res.send('Logout user');
  }
}