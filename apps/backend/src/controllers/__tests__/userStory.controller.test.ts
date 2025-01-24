import { Request, Response } from 'express';
import { UserController } from '../user.controller';
import * as userService from '../../services/user.service';
import { User } from '@prisma/client';
import { NewUserInput, UpdateUserInput, GiveRoleInput } from '../../types/http/user.http';
import { redisClient } from '../../utils/redisClient';
import { mapRedisHash, saveToRedisHash } from '../../utils/redisCache';

jest.mock('../../services/user.service');
jest.mock('../../utils/redisClient');
jest.mock('../../utils/redisCache');

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

  afterAll(async () => {
    await redisClient.quit();
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      (userService.getAllUsers as jest.Mock).mockResolvedValue([exampleUser]);

      await userController.getUsers(req as Request, res as Response);

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([exampleUser]);
    });

    it('should handle errors', async () => {
      (userService.getAllUsers as jest.Mock).mockRejectedValue(new Error('Error'));

      await userController.getUsers(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
    });
  });

  describe('getSingleUser', () => {
    it('should return a user by ID from cache', async () => {
      req.params = { userId: '1' };
      (redisClient.hGetAll as jest.Mock).mockResolvedValue({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        roles: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      (mapRedisHash as jest.Mock).mockReturnValue(exampleUser);

      await userController.getSingleUser(req as Request, res as Response);

      expect(redisClient.hGetAll).toHaveBeenCalledWith('user:1');
      expect(mapRedisHash).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(exampleUser);
    });

    it('should return a user by ID from database and cache it', async () => {
      req.params = { userId: '1' };
      (redisClient.hGetAll as jest.Mock).mockResolvedValue({});
      (userService.getUserById as jest.Mock).mockResolvedValue(exampleUser);
      (saveToRedisHash as jest.Mock).mockReturnValue({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        roles: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      await userController.getSingleUser(req as Request, res as Response);

      expect(redisClient.hGetAll).toHaveBeenCalledWith('user:1');
      expect(userService.getUserById).toHaveBeenCalledWith(1);
      expect(redisClient.hSet).toHaveBeenCalledWith('user:1', expect.any(Object));
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
      (redisClient.hGetAll as jest.Mock).mockRejectedValue(new Error('Error'));

      await userController.getSingleUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      req.body = { name: 'John Doe', email: 'john@example.com', password: 'password', roles: 1 } as NewUserInput;
      (userService.createNewUser as jest.Mock).mockResolvedValue(exampleUser);

      await userController.createUser(req as Request, res as Response);

      expect(userService.createNewUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(exampleUser);
    });

    it('should handle missing request body', async () => {
      req.body = undefined;

      await userController.createUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Request body is required' });
    });

    it('should handle errors', async () => {
      req.body = { name: 'John Doe', email: 'john@example.com', password: 'password', roles: 1 } as NewUserInput;
      (userService.createNewUser as jest.Mock).mockRejectedValue(new Error('Error'));

      await userController.createUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      req.params = { userId: '1' };
      req.body = { name: 'John Doe2', email: 'john2@example.com' } as UpdateUserInput;
      (userService.updateExistingUser as jest.Mock).mockResolvedValue({ ...exampleUser, ...req.body });

      await userController.updateUser(req as Request, res as Response);

      expect(userService.updateExistingUser).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ...exampleUser, ...req.body });
    });

    it('should handle missing userId', async () => {
      req.params = {};
      req.body = { name: 'John Doe2', email: 'john2@example.com' } as UpdateUserInput;

      await userController.updateUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'User ID is required' });
    });

    it('should handle missing request body', async () => {
      req.params = { userId: '1' };
      req.body = undefined;

      await userController.updateUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Request body is required' });
    });

    it('should handle errors', async () => {
      req.params = { userId: '1' };
      req.body = { name: 'John Doe2', email: 'john2@example.com' } as UpdateUserInput;
      (userService.updateExistingUser as jest.Mock).mockRejectedValue(new Error('Error'));

      await userController.updateUser(req as Request, res as Response);

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
      (userService.deleteUserById as jest.Mock).mockRejectedValue(new Error('Error'));

      await userController.deleteUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
    });
  });

  describe('giveUserRole', () => {
    it('should change the user role', async () => {
      req.params = { userId: '1' };
      req.body = { roles: 2 } as GiveRoleInput;
      (userService.changeUserRole as jest.Mock).mockResolvedValue({ ...exampleUser, roles: 2 });

      await userController.giveUserRole(req as Request, res as Response);

      expect(userService.changeUserRole).toHaveBeenCalledWith(1, 2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ...exampleUser, roles: 2 });
    });

    it('should handle missing userId', async () => {
      req.params = {};
      req.body = { roles: 2 } as GiveRoleInput;

      await userController.giveUserRole(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'User ID is required' });
    });

    it('should handle missing roles', async () => {
      req.params = { userId: '1' };
      req.body = {} as GiveRoleInput;

      await userController.giveUserRole(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Roles are required' });
    });

    it('should handle errors', async () => {
      req.params = { userId: '1' };
      req.body = { roles: 2 } as GiveRoleInput;
      (userService.changeUserRole as jest.Mock).mockRejectedValue(new Error('Error'));

      await userController.giveUserRole(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
    });
  });
});