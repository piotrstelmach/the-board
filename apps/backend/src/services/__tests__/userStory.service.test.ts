import { prismaClient } from '../../utils/database';
import { UserStory } from '@prisma/client';
import * as userStoryService from '../userStory.service';
import {
  NewUserStoryInput,
  UpdateUserStoryInput,
} from '../../types/http/userStory.http';
import { redisClient } from '../../utils/redisClient';
import { mapRedisHash, saveToRedisHash } from '../../utils/redisCache';

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

jest.mock('../../utils/redisClient');
jest.mock('../../utils/redisCache');

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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserStories', () => {
    it('should return all user stories from cache', async () => {
      (redisClient.hGetAll as jest.Mock).mockResolvedValue({
        '0': JSON.stringify(exampleUserStory),
      });
      (mapRedisHash as jest.Mock).mockReturnValue([exampleUserStory]);

      const userStories = await userStoryService.getUserStories(1, 10);

      expect(redisClient.hGetAll).toHaveBeenCalledWith(
        'pagination:userStory:page1limit:10'
      );
      expect(mapRedisHash).toHaveBeenCalled();
      expect(userStories).toEqual([exampleUserStory]);
    });

    it('should return all user stories from database and cache them', async () => {
      (redisClient.hGetAll as jest.Mock).mockResolvedValue({});
      (prismaClient.userStory.findMany as jest.Mock).mockResolvedValue([
        exampleUserStory,
      ]);
      (saveToRedisHash as jest.Mock).mockReturnValue({
        '0': JSON.stringify(exampleUserStory),
      });

      const userStories = await userStoryService.getUserStories(1, 10);

      expect(redisClient.hGetAll).toHaveBeenCalledWith(
        'pagination:userStory:page1limit:10'
      );
      expect(prismaClient.userStory.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(redisClient.hSet).toHaveBeenCalledWith(
        'pagination:userStory:page1limit:10',
        expect.any(Object)
      );
      expect(userStories).toEqual([exampleUserStory]);
    });

    it('should throw an error if fetching user stories fails', async () => {
      (redisClient.hGetAll as jest.Mock).mockRejectedValue(
        new Error('Error fetching user stories')
      );

      await expect(userStoryService.getUserStories(1, 10)).rejects.toThrow(
        'Error fetching user stories'
      );
    });
  });

  describe('getSingleUserStory', () => {
    it('should return a user story by ID from cache', async () => {
      (redisClient.hGetAll as jest.Mock).mockResolvedValue({
        id: '1',
        title: 'User Story 1',
        description: 'Description of user story 1',
        priority: 'MEDIUM',
        status: 'PLANNED',
        epicId: '1',
        storyPoints: '10',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      (mapRedisHash as jest.Mock).mockReturnValue(exampleUserStory);

      const userStory = await userStoryService.getSingleUserStory(1);

      expect(redisClient.hGetAll).toHaveBeenCalledWith('userStory:1');
      expect(mapRedisHash).toHaveBeenCalled();
      expect(userStory).toEqual(exampleUserStory);
    });

    it('should return a user story by ID from database and cache it', async () => {
      (redisClient.hGetAll as jest.Mock).mockResolvedValue({});
      (prismaClient.userStory.findUnique as jest.Mock).mockResolvedValue(
        exampleUserStory
      );

      const userStory = await userStoryService.getSingleUserStory(1);

      expect(redisClient.hGetAll).toHaveBeenCalledWith('userStory:1');
      expect(prismaClient.userStory.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(userStory).toEqual(exampleUserStory);
    });

    it('should throw an error if user story not found', async () => {
      (redisClient.hGetAll as jest.Mock).mockResolvedValue({});
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
