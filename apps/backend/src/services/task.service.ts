import { prismaClient } from '../utils/database';
import { NewTaskInput, UpdateTaskInput } from '../types/http/task.http';
import { redisClient } from '../utils/redisClient';
import {
  invalidatePaginatedCache,
  mapRedisHash,
  saveToRedisHash,
} from '../utils/redisCache';
import { Task } from '@prisma/client';

export const TASK_CACHE_NAME = 'task';
export const PAGINATE_TASK_CACHE_NAME = 'pagination:task';

export const getAllTasks = async (page: number, limit: number) => {
  try {
    const cache = await redisClient.hGetAll(
      `${PAGINATE_TASK_CACHE_NAME}:page${page}limit:${limit}`
    );

    if (Object.keys(cache)?.length) {
      return mapRedisHash<Task[]>(cache);
    } else {
      const tasks = await prismaClient.task.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });
      await redisClient.hSet(
        `${PAGINATE_TASK_CACHE_NAME}:page${page}limit:${limit}`,
        saveToRedisHash<Task[]>(tasks)
      );
      return tasks;
    }
  } catch (e) {
    throw new Error('Error fetching tasks');
  }
};

export const getTaskById = async (taskId: number) => {
  try {
    const taskCache = await redisClient.hGetAll(`${TASK_CACHE_NAME}:${taskId}`);

    if (Object.keys(taskCache)?.length) {
      return mapRedisHash<Task>(taskCache);
    } else {
      const task = await prismaClient.task.findUnique({
        where: {
          id: taskId,
        },
      });

      if (!task) {
        throw new Error('Task not found');
      } else {
        return task;
      }
    }
  } catch (e) {
    throw new Error('Task not found');
  }
};

export const createTask = async (data: NewTaskInput) => {
  try {
    await invalidatePaginatedCache(PAGINATE_TASK_CACHE_NAME);
    return prismaClient.task.create({
      data: {
        ...data,
      },
    });
  } catch (e) {
    throw new Error('Error creating task');
  }
};

export const updateTask = async (taskId: number, data: UpdateTaskInput) => {
  const task = await prismaClient.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!task) {
    throw new Error('Task not found');
  } else {
    try {
      await invalidatePaginatedCache(PAGINATE_TASK_CACHE_NAME);
      return prismaClient.task.update({
        where: {
          id: taskId,
        },
        data: {
          ...task,
          ...data,
        },
      });
    } catch (e) {
      throw new Error('Error updating task');
    }
  }
};

export const deleteTask = async (taskId: number) => {
  const task = await prismaClient.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!task) {
    throw new Error('Task not found');
  } else {
    try {
      await invalidatePaginatedCache(PAGINATE_TASK_CACHE_NAME);
      return prismaClient.task.delete({
        where: {
          id: taskId,
        },
      });
    } catch (e) {
      throw new Error('Error deleting task');
    }
  }
};
