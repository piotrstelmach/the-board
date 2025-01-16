import { prismaClient } from '../utils/database';

export const getAllSprints = async () => {
  return prismaClient.sprint.findMany();
}

export const getSprintById = async (sprintId: number) => {
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

export const createNewSprint = async (data: any) => {
  return prismaClient.sprint.create({
    data: {
      ...data,
    },
  });
}

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
}

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
}