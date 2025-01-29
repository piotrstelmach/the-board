import { prismaClient } from '../../utils/database';
import { User } from '@prisma/client';
import { NewUserInput, UpdateUserInput } from '../../types/http/user.http';
import * as userService from '../user.service';
import { hashPassword } from '../../utils/passwd';
import { redisClient } from '../../utils/redisClient';
import { mapRedisHash, saveToRedisHash } from '../../utils/redisCache';

jest.mock('../../utils/database', () => ({
  prismaClient: {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock('../../utils/passwd', () => ({
  hashPassword: jest.fn(),
}));

jest.mock('../../utils/redisClient', () => ({
  redisClient: {
    hGetAll: jest.fn(),
    hSet: jest.fn(),
    del: jest.fn(),
    quit: jest.fn(),
  },
}));

jest.mock('../../utils/redisCache', () => ({
  mapRedisHash: jest.fn(),
  saveToRedisHash: jest.fn(),
}));

describe('UserService', () => {
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
    (hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users from cache', async () => {
      (redisClient.hGetAll as jest.Mock).mockResolvedValue({
        '0': JSON.stringify(exampleUser),
      });
      (mapRedisHash as jest.Mock).mockReturnValue([exampleUser]);

      const users = await userService.getAllUsers(1, 10);

      expect(redisClient.hGetAll).toHaveBeenCalledWith(
        'pagination:user:page1limit:10'
      );
      expect(mapRedisHash).toHaveBeenCalled();
      expect(users).toEqual([exampleUser]);
    });

    it('should return all users from database and cache them', async () => {
      (redisClient.hGetAll as jest.Mock).mockResolvedValue({});
      (prismaClient.user.findMany as jest.Mock).mockResolvedValue([
        exampleUser,
      ]);
      (saveToRedisHash as jest.Mock).mockReturnValue({
        '0': JSON.stringify(exampleUser),
      });

      const users = await userService.getAllUsers(1, 10);

      expect(redisClient.hGetAll).toHaveBeenCalledWith(
        'pagination:user:page1limit:10'
      );
      expect(prismaClient.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(redisClient.hSet).toHaveBeenCalledWith(
        'pagination:user:page1limit:10',
        expect.any(Object)
      );
      expect(users).toEqual([exampleUser]);
    });

    it('should throw an error if fetching users fails', async () => {
      (redisClient.hGetAll as jest.Mock).mockRejectedValue(
        new Error('Error fetching users')
      );

      await expect(userService.getAllUsers(1, 10)).rejects.toThrow(
        'Error fetching users'
      );
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID from cache', async () => {
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

      const user = await userService.getUserById(1);

      expect(redisClient.hGetAll).toHaveBeenCalledWith('user:1');
      expect(mapRedisHash).toHaveBeenCalled();
      expect(user).toEqual(exampleUser);
    });

    it('should return a user by ID from database and cache it', async () => {
      (redisClient.hGetAll as jest.Mock).mockResolvedValue({});
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(
        exampleUser
      );
      (saveToRedisHash as jest.Mock).mockReturnValue({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        roles: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const user = await userService.getUserById(1);

      expect(redisClient.hGetAll).toHaveBeenCalledWith('user:1');
      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(redisClient.hSet).toHaveBeenCalledWith(
        'user:1',
        expect.any(Object)
      );
      expect(user).toEqual(exampleUser);
    });

    it('should throw an error if user not found', async () => {
      (redisClient.hGetAll as jest.Mock).mockResolvedValue({});
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(userService.getUserById(1)).rejects.toThrow(
        'User not found'
      );
    });
  });

  describe('createNewUser', () => {
    it('should create a new user', async () => {
      const newUserInput: NewUserInput = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        roles: 1,
      };
      (prismaClient.user.create as jest.Mock).mockResolvedValue(exampleUser);

      const user = await userService.createNewUser(newUserInput);

      expect(prismaClient.user.create).toHaveBeenCalledWith({
        data: { ...newUserInput, password: 'hashedPassword' },
      });
      expect(user).toEqual(exampleUser);
    });
  });

  describe('updateExistingUser', () => {
    it('should update an existing user', async () => {
      const updateUserInput: UpdateUserInput = {
        name: 'John Doe2',
        email: 'john2@example.com',
      };
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(
        exampleUser
      );
      (prismaClient.user.update as jest.Mock).mockResolvedValue({
        ...exampleUser,
        ...updateUserInput,
      });

      const user = await userService.updateExistingUser(1, updateUserInput);

      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaClient.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { ...exampleUser, ...updateUserInput },
      });
      expect(user).toEqual({ ...exampleUser, ...updateUserInput });
    });

    it('should throw an error if user not found', async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        userService.updateExistingUser(1, {
          name: 'John Doe2',
          email: 'john2@example.com',
        })
      ).rejects.toThrow('User not found');
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user by ID', async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(
        exampleUser
      );
      (prismaClient.user.delete as jest.Mock).mockResolvedValue(exampleUser);

      const user = await userService.deleteUserById(1);

      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaClient.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(user).toEqual(exampleUser);
    });

    it('should throw an error if user not found', async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(userService.deleteUserById(1)).rejects.toThrow(
        'User not found'
      );
    });
  });

  describe('changeUserRole', () => {
    it('should change the user role', async () => {
      const newRole = 2;
      const updatedUser = { ...exampleUser, roles: newRole };
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(
        exampleUser
      );
      (prismaClient.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const user = await userService.changeUserRole(1, newRole);

      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaClient.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { roles: newRole },
      });
      expect(user).toEqual(updatedUser);
    });

    it('should throw an error if user not found', async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(userService.changeUserRole(1, 2)).rejects.toThrow(
        'User not found'
      );
    });
  });
});
