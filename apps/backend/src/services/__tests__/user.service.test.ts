import { prismaClient } from '../../utils/database';
import { User } from '@prisma/client';
import { NewUserInput, UpdateUserInput } from '../../types/http/user.http';
import * as userService from '../user.service';
import { hashPassword } from '../../utils/passwd';

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
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      (prismaClient.user.findMany as jest.Mock).mockResolvedValue([exampleUser]);

      const users = await userService.getAllUsers();

      expect(prismaClient.user.findMany).toHaveBeenCalled();
      expect(users).toEqual([exampleUser]);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(exampleUser);

      const user = await userService.getUserById(1);

      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(user).toEqual(exampleUser);
    });

    it('should throw an error if user not found', async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(userService.getUserById(1)).rejects.toThrow('User not found');
    });
  });

  describe('createNewUser', () => {
    it('should create a new user', async () => {
      const newUserInput: NewUserInput = { name: 'John Doe', email: 'john@example.com', password: 'password', roles: 1 };
      (prismaClient.user.create as jest.Mock).mockResolvedValue(exampleUser);

      const user = await userService.createNewUser(newUserInput);

      expect(prismaClient.user.create).toHaveBeenCalledWith({ data: { ...newUserInput, password: 'hashedPassword' } });
      expect(user).toEqual(exampleUser);
    });
  });

  describe('updateExistingUser', () => {
    it('should update an existing user', async () => {
      const updateUserInput: UpdateUserInput = { name: 'John Doe2', email: 'john2@example.com' };
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(exampleUser);
      (prismaClient.user.update as jest.Mock).mockResolvedValue({ ...exampleUser, ...updateUserInput });

      const user = await userService.updateExistingUser(1, updateUserInput);

      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prismaClient.user.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { ...exampleUser, ...updateUserInput } });
      expect(user).toEqual({ ...exampleUser, ...updateUserInput });
    });

    it('should throw an error if user not found', async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(userService.updateExistingUser(1, { name: 'John Doe2', email: 'john2@example.com' })).rejects.toThrow('User not found');
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user by ID', async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(exampleUser);
      (prismaClient.user.delete as jest.Mock).mockResolvedValue(exampleUser);

      const user = await userService.deleteUserById(1);

      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prismaClient.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(user).toEqual(exampleUser);
    });

    it('should throw an error if user not found', async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(userService.deleteUserById(1)).rejects.toThrow('User not found');
    });
  });

  describe('changeUserRole', () => {
    it('should change the user role', async () => {
      const newRole = 2;
      const updatedUser = { ...exampleUser, roles: newRole };
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(exampleUser);
      (prismaClient.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const user = await userService.changeUserRole(1, newRole);

      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prismaClient.user.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { roles: newRole } });
      expect(user).toEqual(updatedUser);
    });

    it('should throw an error if user not found', async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(userService.changeUserRole(1, 2)).rejects.toThrow('User not found');
    });
  });
});