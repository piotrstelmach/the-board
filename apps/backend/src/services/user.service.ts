import { prismaClient } from '../utils/database';
import { User } from '@prisma/client';
import { NewUserInput, UpdateUserInput } from '../types/http/user.http';

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

export const createNewUser = (data: NewUserInput): Promise<User> => {
  return prismaClient.user.create({
    data: {
      ...data,
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