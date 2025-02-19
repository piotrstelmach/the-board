import { prismaClient } from '../../utils/database';
import { NewUserInput, UpdateUserInput } from '../../types/http/user.http';
import * as userService from '../user.service';
import { redisClient } from '../../utils/redisClient';
import {
  mapRedisHash,
  saveToRedisHash,
  invalidatePaginatedCache,
} from '../../utils/redisCache';
import { ResultUser } from '../../types/global';

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

jest.mock('../../utils/redisClient');
jest.mock('../../utils/redisCache');
jest.mock('../../utils/passwd', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('UserService', () => {
  const exampleUser: ResultUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    roles: 1,
  };

  beforeEach(() => {
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
        name: 'Test User',
        email: 'test@example.com',
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
        name: 'Test User',
        email: 'test@example.com',
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

  describe('createUser', () => {
    it('should create a new user', async () => {
      const newUserInput: NewUserInput = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        roles: 1,
      };
      (prismaClient.user.create as jest.Mock).mockResolvedValue(exampleUser);

      const user = await userService.createNewUser(newUserInput);

      expect(prismaClient.user.create).toHaveBeenCalledWith({
        data: {
          ...newUserInput,
          password: 'hashedPassword',
        },
      });
      expect(invalidatePaginatedCache).toHaveBeenCalledWith('pagination:user');
      expect(user).toEqual(exampleUser);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const updateUserInput: UpdateUserInput = {
        name: 'Updated User',
        email: 'updated@example.com',
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
      expect(invalidatePaginatedCache).toHaveBeenCalledWith('pagination:user');
      expect(user).toEqual({ ...exampleUser, ...updateUserInput });
    });

    it('should throw an error if user not found', async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        userService.updateExistingUser(1, {
          name: 'Updated User',
          email: 'updated@example.com',
        })
      ).rejects.toThrow('User not found');
    });
  });

  describe('deleteUser', () => {
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
      expect(invalidatePaginatedCache).toHaveBeenCalledWith('pagination:user');
      expect(user).toEqual(exampleUser);
    });

    it('should throw an error if user not found', async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(userService.deleteUserById(1)).rejects.toThrow(
        'User not found'
      );
    });
  });
});
