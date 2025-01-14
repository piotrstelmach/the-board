import { UserController } from '../user.controller';
import * as userService from '../../services/user.service';
import { Request, Response } from 'express';
import { NewUserInput, UpdateUserInput } from '../../types/http/user.http';
import { TypedRequestBody } from '../../types/global';
import { User } from '@prisma/client';

describe('UserController', () => {
  const exampleUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password',
    roles: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getUsers', () => {
    it('should get all users', async () => {
      const users = [exampleUser, exampleUser, exampleUser];
      jest.spyOn(userService, 'getAllUsers').mockResolvedValue(users);

      const userController = new UserController();
      await userController.getUsers(req as Request, res as Response);

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      jest.spyOn(userService, 'getAllUsers').mockRejectedValue(error);

      const userController = new UserController();
      await userController.getUsers(req as Request, res as Response);

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getSingleUser', () => {
    it('should get a single user', async () => {
      req.params = { userId: '1' };
      jest.spyOn(userService, 'getUserById').mockResolvedValue(exampleUser);

      const userController = new UserController();
      await userController.getSingleUser(req as Request, res as Response);

      expect(userService.getUserById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(exampleUser);
    });

    it('should return 400 if userId is not provided', async () => {
      const userController = new UserController();
      await userController.getSingleUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'User ID is required' });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      req.params = { userId: '1' };
      jest.spyOn(userService, 'getUserById').mockRejectedValue(error);

      const userController = new UserController();
      await userController.getSingleUser(req as Request, res as Response);

      expect(userService.getUserById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      req.body = { name: 'John Doe', email: 'john@example.com', password: 'password', roles: 1 } as NewUserInput;
      jest.spyOn(userService, 'createNewUser').mockResolvedValue(exampleUser);

      const userController = new UserController();
      await userController.createUser(req as TypedRequestBody<NewUserInput>, res as Response);

      expect(userService.createNewUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(exampleUser);
    });

    it('should return 400 if request body is not provided', async () => {
      const userController = new UserController();
      await userController.createUser(req as TypedRequestBody<NewUserInput>, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Request body is required' });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      req.body = { name: 'John Doe', email: 'john@example.com', password: 'password', roles: 1 };
      jest.spyOn(userService, 'createNewUser').mockRejectedValue(error);

      const userController = new UserController();
      await userController.createUser(req as TypedRequestBody<NewUserInput>, res as Response);

      expect(userService.createNewUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const updatedUser = { ...exampleUser, name: 'John Doe2' };
      req.params = { userId: '1' };
      req.body = { name: 'John Doe2' } as UpdateUserInput;
      jest.spyOn(userService, 'updateExistingUser').mockResolvedValue(updatedUser);

      const userController = new UserController();
      await userController.updateUser(req as TypedRequestBody<UpdateUserInput>, res as Response);

      expect(userService.updateExistingUser).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    it('should return 400 if userId is not provided', async () => {
      const userController = new UserController();
      await userController.updateUser(req as TypedRequestBody<UpdateUserInput>, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'User ID is required' });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      req.params = { userId: '1' };
      req.body = { name: 'John Doe', email: 'john@example.com' } as UpdateUserInput;
      jest.spyOn(userService, 'updateExistingUser').mockRejectedValue(error);

      const userController = new UserController();
      await userController.updateUser(req as TypedRequestBody<UpdateUserInput>, res as Response);

      expect(userService.updateExistingUser).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const deletedUser = exampleUser;
      req.params = { userId: '1' };
      jest.spyOn(userService, 'deleteUserById').mockResolvedValue(deletedUser);

      const userController = new UserController();
      await userController.deleteUser(req as Request, res as Response);

      expect(userService.deleteUserById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(deletedUser);
    });

    it('should return 400 if userId is not provided', async () => {
      const userController = new UserController();
      await userController.deleteUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'User ID is required' });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      req.params = { userId: '1' };
      jest.spyOn(userService, 'deleteUserById').mockRejectedValue(error);

      const userController = new UserController();
      await userController.deleteUser(req as Request, res as Response);

      expect(userService.deleteUserById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});