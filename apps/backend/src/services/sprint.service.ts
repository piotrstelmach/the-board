import { prismaClient } from '../utils/database';
import { redisClient } from '../utils/redisClient';
import { mapRedisHash } from '../utils/redisCache';
import { Sprint } from '@prisma/client';

const SPRINT_CACHE_NAME = 'sprint';

export const getAllSprints = async () => {
  return prismaClient.sprint.findMany();
};

export const getSprintById = async (sprintId: number) => {
  try {
    const sprintCache = await redisClient.hGetAll(
      `${SPRINT_CACHE_NAME}:${sprintId}`
    );
    if (Object.keys(sprintCache)?.length) {
      return mapRedisHash<Sprint>(sprintCache);
    } else {
      const sprint = await prismaClient.sprint.findUnique({
        where: {
          id: sprintId,
        },
      });

      if (!sprint) {
        throw new Error('Sprint not found');
      } else {
        return sprint;
      }
    }
  } catch (error) {
    throw new Error('Sprint not found');
  }
};

export const createNewSprint = async (data: any) => {
  return prismaClient.sprint.create({
    data: {
      ...data,
    },
  });
};

export const updateExistingSprint = async (sprintId: number, data: any) => {
  const sprint = await prismaClient.sprint.findUnique({
    where: {
      id: sprintId,
    },
  });

  if (!sprint) {
    throw new Error('Sprint not found');
  } else {
    return prismaClient.sprint.update({
      where: {
        id: sprintId,
      },
      data: {
        ...sprint,
        ...data,
      },
    });
  }
};

export const deleteSprintById = async (sprintId: number) => {
  const sprint = await prismaClient.sprint.findUnique({
    where: {
      id: sprintId,
    },
  });

  if (!sprint) {
    throw new Error('Sprint not found');
  } else {
    return prismaClient.sprint.delete({
      where: {
        id: sprintId,
      },
    });
  }
};
