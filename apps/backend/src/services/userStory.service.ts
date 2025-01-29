import { prismaClient } from '../utils/database';
import {
  NewUserStoryInput,
  UpdateUserStoryInput,
} from '../types/http/userStory.http';
import { redisClient } from '../utils/redisClient';
import { mapRedisHash, saveToRedisHash } from '../utils/redisCache';
import { UserStory } from '@prisma/client';

const STORY_CACHE_NAME = 'userStory';
const PAGINATE_STORY_CACHE_NAME = 'pagination:userStory';

export const getUserStories = async (page: number, limit: number) => {
  try {
    const cache = await redisClient.hGetAll(
      `${PAGINATE_STORY_CACHE_NAME}:page${page}limit:${limit}`
    );
    if (Object.keys(cache)?.length) {
      return mapRedisHash<UserStory[]>(cache);
    } else {
      const userStories = await prismaClient.userStory.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });

      await redisClient.hSet(
        `${PAGINATE_STORY_CACHE_NAME}:page${page}limit:${limit}`,
        saveToRedisHash<UserStory[]>(userStories)
      );

      return userStories;
    }
  } catch (e) {
    throw new Error('Error fetching user stories');
  }
};

export const getSingleUserStory = async (userStoryId: number) => {
  try {
    const storyCache = await redisClient.hGetAll(
      `${STORY_CACHE_NAME}:${userStoryId}`
    );

    if (Object.keys(storyCache)?.length) {
      return mapRedisHash<UserStory>(storyCache);
    } else {
      const userStory = await prismaClient.userStory.findUnique({
        where: {
          id: userStoryId,
        },
      });

      if (!userStory) {
        throw new Error('User story not found');
      } else {
        return userStory;
      }
    }
  } catch (e) {
    throw new Error('User story not found');
  }
};

export const createUserStory = async (data: NewUserStoryInput) => {
  return prismaClient.userStory.create({
    data: {
      ...data,
    },
  });
};

export const updateUserStory = async (
  userStoryId: number,
  data: UpdateUserStoryInput
) => {
  const userStory = await prismaClient.userStory.findUnique({
    where: {
      id: userStoryId,
    },
  });

  if (!userStory) {
    throw new Error('User story not found');
  } else {
    return prismaClient.userStory.update({
      where: {
        id: userStoryId,
      },
      data: {
        ...userStory,
        ...data,
      },
    });
  }
};

export const deleteUserStory = async (userStoryId: number) => {
  const userStory = await prismaClient.userStory.findUnique({
    where: {
      id: userStoryId,
    },
  });

  if (!userStory) {
    throw new Error('User story not found');
  } else {
    return prismaClient.userStory.delete({
      where: {
        id: userStoryId,
      },
    });
  }
};
