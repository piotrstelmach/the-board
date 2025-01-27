import { prismaClient } from '../utils/database';
import { NewTaskInput, UpdateTaskInput } from '../types/http/task.http';
import { redisClient } from '../utils/redisClient';
import { mapRedisHash } from '../utils/redisCache';
import { Task } from '@prisma/client';

export const TASK_CACHE_NAME = 'task';

export const getAllTasks = async () => {
  return prismaClient.task.findMany();
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
  return prismaClient.task.create({
    data: {
      ...data,
    },
  });
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
    return prismaClient.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...task,
        ...data,
      },
    });
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
    return prismaClient.task.delete({
      where: {
        id: taskId,
      },
    });
  }
};
