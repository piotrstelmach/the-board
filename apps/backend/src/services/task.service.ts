import { prismaClient } from '../utils/database';
import { NewTaskInput, UpdateTaskInput } from '../types/http/user.http';

export const getAllTasks = async () => {
  return prismaClient.task.findMany();
}

export const getTaskById = async (taskId: number) => {
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

export const createTask = async (data: NewTaskInput) => {
  return prismaClient.task.create({
    data: {
      ...data,
    },
  });
}

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
}

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
}