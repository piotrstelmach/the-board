import { prismaClient } from '../utils/database';
import { NewUserStoryInput, UpdateUserStoryInput } from '../types/http/userStory.http';

export const getUserStories = async () => {
  return prismaClient.userStory.findMany();
};

export const getSingleUserStory = async (userStoryId: number) => {
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
