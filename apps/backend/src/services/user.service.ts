import { prismaClient } from '../utils/database';
import { User } from '@prisma/client';
import { NewUserInput, UpdateUserInput } from '../types/http/user.http';
import { hashPassword } from '../utils/passwd';

export const getAllUsers = (): Promise<User[]> => {
  return prismaClient.user.findMany();
};

export const getUserById= async (userId: number): Promise<User> => {
  const user: User | null = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error('User not found');
  } else {
    return user;
  }
};

export const getUserByEmail = async (email: string): Promise<User> => {
  const user: User | null = await prismaClient.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new Error('User not found');
  } else {
    return user;
  }
}

export const createNewUser = async (data: NewUserInput): Promise<User> => {
  const hashedPassword = await hashPassword(data.password);
  return prismaClient.user.create({
    data: {
      ...data,
      password: hashedPassword
    },
  });
};

export const updateExistingUser = async (userId: number, data: UpdateUserInput): Promise<User> => {
  const user: User | null = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error('User not found');
  } else {
    return prismaClient.user.update({
      where: {
        id: userId,
      },
      data: {
        ...user,
        ...data,
      },
    });
  }
}

export const deleteUserById = async (userId: number): Promise<User> => {
  const user: User | null = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error('User not found');
  } else {
    return prismaClient.user.delete({
      where: {
        id: userId,
      },
    });
  }
}

export const changeUserRole = async (userId: number, newRole: number): Promise<User> => {
  const user: User | null = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error('User not found');
  } else {
    return prismaClient.user.update({
      where: {
        id: userId,
      },
      data: {
        roles: newRole,
      },
    });
  }
}