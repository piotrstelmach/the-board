import { prismaClient } from '../utils/database';
import {
  NewUserStoryInput,
  UpdateUserStoryInput,
} from '../types/http/userStory.http';
import { redisClient } from '../utils/redisClient';
import { mapRedisHash } from '../utils/redisCache';
import { UserStory } from '@prisma/client';

export const getUserStories = async () => {
  return prismaClient.userStory.findMany();
};

export const STORY_CACHE_NAME = 'userStory';

export const getSingleUserStory = async (userStoryId: number) => {
  try {
    const storyCache = await redisClient.hGetAll(`userStory:${userStoryId}`);

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
