import { Request, Response } from 'express';
import { UserController } from '../user.controller';
import * as userService from '../../services/user.service';
import { User } from '@prisma/client';
import { TypedRequestBody, TypedRequestQueryParams } from '../../types/global';
import { PaginationParams } from '../../types/http/pagination.http';
import { NewUserInput, UpdateUserInput } from '../../types/http/user.http';

jest.mock('../../services/user.service');

describe('UserController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let userController: UserController;

  const exampleUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    roles: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    userController = new UserController();
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      req.query = { page: '1', limit: '10' } as unknown as PaginationParams;
      (userService.getAllUsers as jest.Mock).mockResolvedValue([exampleUser]);

      await userController.getUsers(
        req as TypedRequestQueryParams<PaginationParams>,
        res as Response
      );

      expect(userService.getAllUsers).toHaveBeenCalledWith(1, 10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([exampleUser]);
    });

    it('should handle errors', async () => {
      req.query = { page: '1', limit: '10' } as unknown as PaginationParams;
      (userService.getAllUsers as jest.Mock).mockRejectedValue(
        new Error('Error')
      );

      await userController.getUsers(
        req as TypedRequestQueryParams<PaginationParams>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
    });
  });

  describe('getSingleUser', () => {
    it('should return a user by ID', async () => {
      req.params = { userId: '1' };
      (userService.getUserById as jest.Mock).mockResolvedValue(exampleUser);

      await userController.getSingleUser(req as Request, res as Response);

      expect(userService.getUserById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(exampleUser);
    });

    it('should handle missing userId', async () => {
      req.params = {};

      await userController.getSingleUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'User ID is required' });
    });

    it('should handle errors', async () => {
      req.params = { userId: '1' };
      (userService.getUserById as jest.Mock).mockRejectedValue(
        new Error('Error')
      );

      await userController.getSingleUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      req.body = exampleUser;
      (userService.createNewUser as jest.Mock).mockResolvedValue(exampleUser);

      await userController.createUser(
        req as TypedRequestBody<NewUserInput>,
        res as Response
      );

      expect(userService.createNewUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(exampleUser);
    });

    it('should handle missing request body', async () => {
      req.body = undefined;

      await userController.createUser(
        req as TypedRequestBody<NewUserInput>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Request body is required',
      });
    });

    it('should handle errors', async () => {
      req.body = exampleUser;
      (userService.createNewUser as jest.Mock).mockRejectedValue(
        new Error('Error')
      );

      await userController.createUser(
        req as TypedRequestBody<NewUserInput>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      req.params = { userId: '1' };
      req.body = { name: 'Jane Doe' };
      const updatedUser = { ...exampleUser, ...req.body };
      (userService.updateExistingUser as jest.Mock).mockResolvedValue(
        updatedUser
      );

      await userController.updateUser(
        req as TypedRequestBody<UpdateUserInput>,
        res as Response
      );

      expect(userService.updateExistingUser).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    it('should handle missing userId', async () => {
      req.params = {};

      await userController.updateUser(
        req as TypedRequestBody<NewUserInput>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'User ID is required' });
    });

    it('should handle missing request body', async () => {
      req.params = { userId: '1' };
      req.body = undefined;

      await userController.updateUser(
        req as TypedRequestBody<UpdateUserInput>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Request body is required',
      });
    });

    it('should handle errors', async () => {
      req.params = { userId: '1' };
      req.body = { name: 'Jane Doe' };
      (userService.updateExistingUser as jest.Mock).mockRejectedValue(
        new Error('Error')
      );

      await userController.updateUser(
        req as TypedRequestBody<UpdateUserInput>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      req.params = { userId: '1' };
      (userService.deleteUserById as jest.Mock).mockResolvedValue(exampleUser);

      await userController.deleteUser(req as Request, res as Response);

      expect(userService.deleteUserById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(exampleUser);
    });

    it('should handle missing userId', async () => {
      req.params = {};

      await userController.deleteUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'User ID is required' });
    });

    it('should handle errors', async () => {
      req.params = { userId: '1' };
      (userService.deleteUserById as jest.Mock).mockRejectedValue(
        new Error('Error')
      );

      await userController.deleteUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
    });
  });

  describe('giveUserRole', () => {
    it('should change the user role', async () => {
      req.params = { userId: '1' };
      req.body = { roles: 2 };
      const updatedUser = { ...exampleUser, roles: 2 };
      (userService.changeUserRole as jest.Mock).mockResolvedValue(updatedUser);

      await userController.giveUserRole(
        req as TypedRequestBody<{ roles: number }>,
        res as Response
      );

      expect(userService.changeUserRole).toHaveBeenCalledWith(1, 2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    it('should handle missing userId', async () => {
      req.params = {};
      req.body = { roles: 2 };

      await userController.giveUserRole(
        req as TypedRequestBody<{ roles: number }>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'User ID is required' });
    });

    it('should handle missing roles', async () => {
      req.params = { userId: '1' };
      req.body = {};

      await userController.giveUserRole(
        req as TypedRequestBody<{ roles: number }>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Roles are required' });
    });

    it('should handle errors', async () => {
      req.params = { userId: '1' };
      req.body = { roles: 2 };
      (userService.changeUserRole as jest.Mock).mockRejectedValue(
        new Error('Error')
      );

      await userController.giveUserRole(
        req as TypedRequestBody<{ roles: number }>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
    });
  });
});
