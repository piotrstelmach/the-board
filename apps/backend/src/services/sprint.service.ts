import { prismaClient } from '../utils/database';
import { redisClient } from '../utils/redisClient';
import {
  invalidatePaginatedCache,
  mapRedisHash,
  saveToRedisHash,
} from '../utils/redisCache';
import { Sprint } from '@prisma/client';

const SPRINT_CACHE_NAME = 'sprint';
const SPRINT_PAGINATE_CACHE_NAME = 'pagination:sprint';

export const getAllSprints = async (page: number, limit: number) => {
  try {
    const cache = await redisClient.hGetAll(
      `${SPRINT_PAGINATE_CACHE_NAME}:page${page}limit:${limit}`
    );
    if (Object.keys(cache)?.length) {
      return mapRedisHash<Sprint[]>(cache);
    } else {
      const sprints = await prismaClient.sprint.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });
      await redisClient.hSet(
        `${SPRINT_PAGINATE_CACHE_NAME}:page${page}limit:${limit}`,
        saveToRedisHash<Sprint[]>(sprints)
      );
      return sprints;
    }
  } catch (e) {
    throw new Error('Error fetching sprints');
  }
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
  try {
    await invalidatePaginatedCache(SPRINT_PAGINATE_CACHE_NAME);
    return prismaClient.sprint.create({
      data: {
        ...data,
      },
    });
  } catch (e) {
    throw new Error('Error creating sprint');
  }
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
    try {
      await invalidatePaginatedCache(SPRINT_PAGINATE_CACHE_NAME);
      return prismaClient.sprint.update({
        where: {
          id: sprintId,
        },
        data: {
          ...sprint,
          ...data,
        },
      });
    } catch (e) {
      throw new Error('Error updating sprint');
    }
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
    try {
      await invalidatePaginatedCache(SPRINT_PAGINATE_CACHE_NAME);
      return prismaClient.sprint.delete({
        where: {
          id: sprintId,
        },
      });
    } catch (e) {
      throw new Error('Error deleting sprint');
    }
  }
};
