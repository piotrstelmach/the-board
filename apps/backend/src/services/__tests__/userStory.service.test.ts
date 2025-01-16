import { prismaClient } from '../../utils/database';
import { UserStory } from '@prisma/client';
import * as userStoryService from '../userStory.service';
import {
  NewUserStoryInput,
  UpdateUserStoryInput,
} from '../../types/http/userStory.http';

jest.mock('../../utils/database', () => ({
  prismaClient: {
    userStory: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('UserStoryService', () => {
  const exampleUserStory: UserStory = {
    id: 1,
    title: 'User Story 1',
    description: 'Description of user story 1',
    priority: 'MEDIUM',
    status: 'PLANNED',
    epicId: 1,
    storyPoints: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('getUserStories', () => {
    it('should return all user stories', async () => {
      (prismaClient.userStory.findMany as jest.Mock).mockResolvedValue([
        exampleUserStory,
      ]);

      const userStories = await userStoryService.getUserStories();

      expect(prismaClient.userStory.findMany).toHaveBeenCalled();
      expect(userStories).toEqual([exampleUserStory]);
    });
  });

  describe('getSingleUserStory', () => {
    it('should return a user story by ID', async () => {
      (prismaClient.userStory.findUnique as jest.Mock).mockResolvedValue(
        exampleUserStory
      );

      const userStory = await userStoryService.getSingleUserStory(1);

      expect(prismaClient.userStory.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(userStory).toEqual(exampleUserStory);
    });

    it('should throw an error if user story not found', async () => {
      (prismaClient.userStory.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(userStoryService.getSingleUserStory(1)).rejects.toThrow(
        'User story not found'
      );
    });
  });

  describe('createUserStory', () => {
    it('should create a new user story', async () => {
      const newUserStoryInput: NewUserStoryInput = {
        title: 'User Story 1',
        description: 'Description of user story 1',
      };
      (prismaClient.userStory.create as jest.Mock).mockResolvedValue(
        exampleUserStory
      );

      const userStory = await userStoryService.createUserStory(
        newUserStoryInput
      );

      expect(prismaClient.userStory.create).toHaveBeenCalledWith({
        data: newUserStoryInput,
      });
      expect(userStory).toEqual(exampleUserStory);
    });
  });

  describe('updateUserStory', () => {
    it('should update an existing user story', async () => {
      const updateUserStoryInput: UpdateUserStoryInput = {
        title: 'Updated User Story',
        description: 'Updated description',
      };
      (prismaClient.userStory.findUnique as jest.Mock).mockResolvedValue(
        exampleUserStory
      );
      (prismaClient.userStory.update as jest.Mock).mockResolvedValue({
        ...exampleUserStory,
        ...updateUserStoryInput,
      });

      const userStory = await userStoryService.updateUserStory(
        1,
        updateUserStoryInput
      );

      expect(prismaClient.userStory.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaClient.userStory.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { ...exampleUserStory, ...updateUserStoryInput },
      });
      expect(userStory).toEqual({
        ...exampleUserStory,
        ...updateUserStoryInput,
      });
    });

    it('should throw an error if user story not found', async () => {
      (prismaClient.userStory.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        userStoryService.updateUserStory(1, {
          title: 'Updated User Story',
          description: 'Updated description',
        })
      ).rejects.toThrow('User story not found');
    });
  });

  describe('deleteUserStory', () => {
    it('should delete a user story by ID', async () => {
      (prismaClient.userStory.findUnique as jest.Mock).mockResolvedValue(
        exampleUserStory
      );
      (prismaClient.userStory.delete as jest.Mock).mockResolvedValue(
        exampleUserStory
      );

      const userStory = await userStoryService.deleteUserStory(1);

      expect(prismaClient.userStory.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaClient.userStory.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(userStory).toEqual(exampleUserStory);
    });

    it('should throw an error if user story not found', async () => {
      (prismaClient.userStory.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(userStoryService.deleteUserStory(1)).rejects.toThrow(
        'User story not found'
      );
    });
  });
});
