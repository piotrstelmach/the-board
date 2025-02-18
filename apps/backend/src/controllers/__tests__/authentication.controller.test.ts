import { Request, Response } from 'express';
import { AuthenticationController } from '../authentication.controller';
import * as authService from '../../services/authentication.service';
import * as userService from '../../services/user.service';
import { AuthUserResult } from '../../services/authentication.service';
import { TypedRequestBody } from '../../types/global';
import {
  LoginUserInput,
  RegisterUserInput,
} from '../../types/http/authentication.http';
import jwt from 'jsonwebtoken';

jest.mock('../../services/authentication.service');
jest.mock('../../services/user.service');
jest.mock('jsonwebtoken');

describe('AuthenticationController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let authenticationController: AuthenticationController;

  const exampleUser: AuthUserResult = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    roles: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    authenticationController = new AuthenticationController();
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user and return tokens', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      } as RegisterUserInput;
      (authService.registerNewUser as jest.Mock).mockResolvedValue(exampleUser);
      (jwt.sign as jest.Mock).mockReturnValue('token');

      await authenticationController.registerUser(
        req as TypedRequestBody<RegisterUserInput>,
        res as Response
      );

      expect(authService.registerNewUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'token',
        expect.any(Object)
      );
      expect(res.json).toHaveBeenCalledWith({
        ...exampleUser,
        accessToken: 'token',
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Registration error');
      req.body = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      } as RegisterUserInput;
      (authService.registerNewUser as jest.Mock).mockRejectedValue(error);

      await authenticationController.registerUser(
        req as TypedRequestBody<RegisterUserInput>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('loginUser', () => {
    it('should login a user and return tokens', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'password',
      } as LoginUserInput;
      (authService.loginUser as jest.Mock).mockResolvedValue(exampleUser);
      (jwt.sign as jest.Mock).mockReturnValue('token');

      await authenticationController.loginUser(
        req as TypedRequestBody<LoginUserInput>,
        res as Response
      );

      expect(authService.loginUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'token',
        expect.any(Object)
      );
      expect(res.json).toHaveBeenCalledWith({
        ...exampleUser,
        accessToken: 'token',
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Login error');
      req.body = {
        email: 'test@example.com',
        password: 'password',
      } as LoginUserInput;
      (authService.loginUser as jest.Mock).mockRejectedValue(error);

      await authenticationController.loginUser(
        req as TypedRequestBody<LoginUserInput>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('logoutUser', () => {
    it('should clear the refresh token cookie', async () => {
      await authenticationController.logoutUser(
        req as Request,
        res as Response
      );

      expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Logout error');
      (res.clearCookie as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await authenticationController.logoutUser(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens', async () => {
      req.cookies = { refreshToken: 'token' };
      (jwt.verify as jest.Mock).mockReturnValue({ user_id: 1 });
      (jwt.sign as jest.Mock).mockReturnValue('newToken');
      (userService.getUserById as jest.Mock).mockResolvedValue(exampleUser);

      await authenticationController.refreshToken(
        req as Request,
        res as Response
      );

      expect(jwt.verify).toHaveBeenCalledWith('token', expect.any(String));
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'newToken',
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        accessToken: 'newToken',
        ...exampleUser,
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Token error');
      req.cookies = { refreshToken: 'token' };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await authenticationController.refreshToken(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});
