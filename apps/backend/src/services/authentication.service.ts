import { RegisterUserInput } from '../types/http/authentication.http';
import * as userService from './user.service';
import { User } from '@prisma/client';

const DEFAULT_ROLE = 1;

export type AuthUserResult = Omit<User, "password">;

export const registerNewUser: (data: RegisterUserInput) => Promise<AuthUserResult | undefined> = async (data: RegisterUserInput) : Promise<AuthUserResult | undefined> => {
  try {
    return await userService.createNewUser({ ...data, roles: DEFAULT_ROLE }) as AuthUserResult;
  } catch (error) {
    if(error instanceof Error) {
      throw new Error('Failed to create user');
    }
  }
}

export const loginUser: (data: RegisterUserInput) => Promise<AuthUserResult | undefined> = async (data: RegisterUserInput): Promise<AuthUserResult | undefined> => {
  try {
    const user: User = await userService.getUserByEmail(data.email);
    //TODO: ADD BCRYPT
    if (user.password === data.password) {
      return user as AuthUserResult;
    } else {
      throw new Error('Invalid password');
    }
  } catch (error) {
    if(error instanceof Error) {
      throw new Error('Failed to create user');
    }
  }
}