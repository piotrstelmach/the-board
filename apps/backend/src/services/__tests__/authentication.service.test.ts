import { registerNewUser, loginUser } from '../authentication.service';
import * as userService from '../user.service';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import {
  RegisterUserInput,
  LoginUserInput,
} from '../../types/http/authentication.http';
import { hashPassword } from '../../utils/passwd';

jest.mock('../user.service');
jest.mock('bcrypt');
jest.mock('../../utils/passwd');

describe('AuthenticationService', () => {
  const exampleUser: User = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    roles: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('registerNewUser', () => {
    it('should register a new user', async () => {
      const input: RegisterUserInput = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      };
      (hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
      (userService.createNewUser as jest.Mock).mockResolvedValue(exampleUser);

      const result = await registerNewUser(input);

      expect(hashPassword).toHaveBeenCalledWith(input.password);
      expect(userService.createNewUser).toHaveBeenCalledWith({
        ...input,
        password: 'hashedPassword',
        roles: 1,
      });
      expect(result).toEqual({
        id: exampleUser.id,
        email: exampleUser.email,
        name: exampleUser.name,
        roles: exampleUser.roles,
        password: 'hashedPassword',
        createdAt: exampleUser.createdAt,
        updatedAt: exampleUser.updatedAt,
      });
    });

    it('should handle errors', async () => {
      const input: RegisterUserInput = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      };
      (hashPassword as jest.Mock).mockRejectedValue(new Error('Hashing error'));

      await expect(registerNewUser(input)).rejects.toThrow('Hashing error');
    });
  });

  describe('loginUser', () => {
    it('should login a user with correct credentials', async () => {
      const input: LoginUserInput = {
        email: 'test@example.com',
        password: 'password',
      };
      (userService.getUserByEmail as jest.Mock).mockResolvedValue(exampleUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await loginUser(input);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(input.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        input.password,
        exampleUser.password
      );
      expect(result).toEqual({
        id: exampleUser.id,
        email: exampleUser.email,
        name: exampleUser.name,
        roles: exampleUser.roles,
        createdAt: exampleUser.createdAt,
        updatedAt: exampleUser.updatedAt,
      });
    });

    it('should throw an error for incorrect password', async () => {
      const input: LoginUserInput = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };
      (userService.getUserByEmail as jest.Mock).mockResolvedValue(exampleUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(loginUser(input)).rejects.toThrow('Invalid password');
    });

    it('should handle errors', async () => {
      const input: LoginUserInput = {
        email: 'test@example.com',
        password: 'password',
      };
      (userService.getUserByEmail as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(loginUser(input)).rejects.toThrow('Database error');
    });
  });
});
