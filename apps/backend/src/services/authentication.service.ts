import {
  LoginUserInput,
  RegisterUserInput,
} from '../types/http/authentication.http';
import * as userService from './user.service';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { hashPassword } from '../utils/passwd';
import { excludePropertyFromObject } from '../utils/object';

const DEFAULT_ROLE = 1;

export type AuthUserResult = Omit<User, 'password'>;

export const registerNewUser: (
  data: RegisterUserInput
) => Promise<AuthUserResult | undefined> = async (
  data: RegisterUserInput
): Promise<AuthUserResult | undefined> => {
  const hashedPassword = await hashPassword(data.password);
  return await userService.createNewUser({
    ...data,
    password: hashedPassword,
    roles: DEFAULT_ROLE,
  });
};

export const loginUser: (
  data: LoginUserInput
) => Promise<AuthUserResult | undefined> = async (
  data: LoginUserInput
): Promise<AuthUserResult | undefined> => {
  const user = await userService.getUserByEmail(data.email);
  const matchPassword = await bcrypt.compare(data.password, user.password);
  if (matchPassword) {
    return excludePropertyFromObject(user, 'password');
  } else {
    throw new Error('Invalid password');
  }
};
