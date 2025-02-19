import { prismaClient } from '../utils/database';
import { User } from '@prisma/client';
import { NewUserInput, UpdateUserInput } from '../types/http/user.http';
import { hashPassword } from '../utils/passwd';
import { redisClient } from '../utils/redisClient';
import {
  invalidatePaginatedCache,
  mapRedisHash,
  saveToRedisHash,
} from '../utils/redisCache';
import { ResultUser } from '../types/global';

const USER_CACHE_NAME = 'user';
const USER_PAGINATE_CACHE_NAME = 'pagination:user';

export const getAllUsers = async (
  page: number,
  limit: number
): Promise<ResultUser[]> => {
  try {
    const cache = await redisClient.hGetAll(
      `${USER_PAGINATE_CACHE_NAME}:page${page}limit:${limit}`
    );
    if (Object.keys(cache)?.length) {
      return mapRedisHash<User[]>(cache);
    } else {
      const users = await prismaClient.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });
      await redisClient.hSet(
        `${USER_PAGINATE_CACHE_NAME}:page${page}limit:${limit}`,
        saveToRedisHash<ResultUser[]>(users)
      );
      return users;
    }
  } catch (e) {
    throw new Error('Error fetching users');
  }
};

export const getUserById = async (userId: number): Promise<ResultUser> => {
  try {
    const cache = await redisClient.hGetAll(`${USER_CACHE_NAME}:${userId}`);
    if (Object.keys(cache)?.length) {
      return mapRedisHash<User>(cache);
    } else {
      const user: ResultUser | null = await prismaClient.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw new Error('User not found');
      } else {
        await redisClient.hSet(
          `${USER_CACHE_NAME}:${userId}`,
          saveToRedisHash<ResultUser>(user)
        );
        return user;
      }
    }
  } catch (error) {
    throw new Error(`User not found`);
  }
};

export const getUserByEmail = async (email: string): Promise<User> => {
  const user: User | null = await prismaClient.user.findUnique({
    omit: {
      password: false,
    },
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new Error('User not found');
  } else {
    return user;
  }
};

export const createNewUser = async (
  data: NewUserInput
): Promise<ResultUser> => {
  try {
    await invalidatePaginatedCache(USER_PAGINATE_CACHE_NAME);
    const hashedPassword = await hashPassword(data.password);
    return prismaClient.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  } catch (e) {
    throw new Error('Error creating user');
  }
};

export const updateExistingUser = async (
  userId: number,
  data: UpdateUserInput
): Promise<ResultUser> => {
  const user: ResultUser | null = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error('User not found');
  } else {
    try {
      await invalidatePaginatedCache(USER_PAGINATE_CACHE_NAME);
      return prismaClient.user.update({
        where: {
          id: userId,
        },
        data: {
          ...user,
          ...data,
        },
      });
    } catch (e) {
      throw new Error('Error updating user');
    }
  }
};

export const deleteUserById = async (userId: number): Promise<ResultUser> => {
  const user: ResultUser | null = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error('User not found');
  } else {
    try {
      await invalidatePaginatedCache(USER_PAGINATE_CACHE_NAME);
      return prismaClient.user.delete({
        where: {
          id: userId,
        },
      });
    } catch (e) {
      throw new Error('Error deleting user');
    }
  }
};

export const changeUserRole = async (
  userId: number,
  newRole: number
): Promise<ResultUser> => {
  let updatedRoles = newRole;
  const user: ResultUser | null = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error('User not found');
  } else {
    try {
      await invalidatePaginatedCache(USER_PAGINATE_CACHE_NAME);
      if ((newRole & user.roles) === user.roles) {
        updatedRoles = user.roles | newRole;
      }

      if ((user.roles & newRole) === newRole) {
        updatedRoles = user.roles & newRole;
      }

      return prismaClient.user.update({
        where: {
          id: userId,
        },
        data: {
          roles: updatedRoles,
        },
      });
    } catch (e) {
      throw new Error('Error updating user');
    }
  }
};
