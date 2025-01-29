import { prismaClient } from '../../utils/database';
import { Sprint } from '@prisma/client';
import * as sprintService from '../sprint.service';
import { redisClient } from '../../utils/redisClient';
import { mapRedisHash, saveToRedisHash } from '../../utils/redisCache';

jest.mock('../../utils/database', () => ({
  prismaClient: {
    sprint: {
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

describe('SprintService', () => {
  const exampleSprint: Sprint = {
    id: 1,
    name: 'Sprint 1',
    goal: 'Complete tasks',
    totalPoints: 10,
    startDate: new Date(),
    endDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllSprints', () => {
    it('should return all sprints from cache', async () => {
      (redisClient.hGetAll as jest.Mock).mockResolvedValue({
        '0': JSON.stringify(exampleSprint),
      });
      (mapRedisHash as jest.Mock).mockReturnValue([exampleSprint]);

      const sprints = await sprintService.getAllSprints(1, 10);

      expect(redisClient.hGetAll).toHaveBeenCalledWith(
        'pagination:sprint:page1limit:10'
      );
      expect(mapRedisHash).toHaveBeenCalled();
      expect(sprints).toEqual([exampleSprint]);
    });

    it('should return all sprints from database and cache them', async () => {
      (redisClient.hGetAll as jest.Mock).mockResolvedValue({});
      (prismaClient.sprint.findMany as jest.Mock).mockResolvedValue([
        exampleSprint,
      ]);
      (saveToRedisHash as jest.Mock).mockReturnValue({
        '0': JSON.stringify(exampleSprint),
      });

      const sprints = await sprintService.getAllSprints(1, 10);

      expect(redisClient.hGetAll).toHaveBeenCalledWith(
        'pagination:sprint:page1limit:10'
      );
      expect(prismaClient.sprint.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(redisClient.hSet).toHaveBeenCalledWith(
        'pagination:sprint:page1limit:10',
        expect.any(Object)
      );
      expect(sprints).toEqual([exampleSprint]);
    });

    it('should throw an error if fetching sprints fails', async () => {
      (redisClient.hGetAll as jest.Mock).mockRejectedValue(
        new Error('Error fetching sprints')
      );

      await expect(sprintService.getAllSprints(1, 10)).rejects.toThrow(
        'Error fetching sprints'
      );
    });
  });

  describe('getSprintById', () => {
    it('should return a sprint by ID from cache', async () => {
      (redisClient.hGetAll as jest.Mock).mockResolvedValue({
        id: '1',
        name: 'Sprint 1',
        goal: 'Complete tasks',
        totalPoints: '10',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      (mapRedisHash as jest.Mock).mockReturnValue(exampleSprint);

      const sprint = await sprintService.getSprintById(1);

      expect(redisClient.hGetAll).toHaveBeenCalledWith('sprint:1');
      expect(mapRedisHash).toHaveBeenCalled();
      expect(sprint).toEqual(exampleSprint);
    });

    it('should return a sprint by ID from database and cache it', async () => {
      (redisClient.hGetAll as jest.Mock).mockResolvedValue({});
      (prismaClient.sprint.findUnique as jest.Mock).mockResolvedValue(
        exampleSprint
      );

      const sprint = await sprintService.getSprintById(1);

      expect(redisClient.hGetAll).toHaveBeenCalledWith('sprint:1');
      expect(prismaClient.sprint.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(sprint).toEqual(exampleSprint);
    });

    it('should throw an error if sprint not found', async () => {
      (redisClient.hGetAll as jest.Mock).mockResolvedValue({});
      (prismaClient.sprint.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(sprintService.getSprintById(1)).rejects.toThrow(
        'Sprint not found'
      );
    });
  });

  describe('createNewSprint', () => {
    it('should create a new sprint', async () => {
      const newSprintInput = {
        name: 'Sprint 1',
        goal: 'Complete tasks',
        startDate: new Date(),
        endDate: new Date(),
      };
      (prismaClient.sprint.create as jest.Mock).mockResolvedValue(
        exampleSprint
      );

      const sprint = await sprintService.createNewSprint(newSprintInput);

      expect(prismaClient.sprint.create).toHaveBeenCalledWith({
        data: newSprintInput,
      });
      expect(sprint).toEqual(exampleSprint);
    });
  });

  describe('updateExistingSprint', () => {
    it('should update an existing sprint', async () => {
      const updateSprintInput = {
        name: 'Updated Sprint',
        goal: 'Updated goal',
      };
      (prismaClient.sprint.findUnique as jest.Mock).mockResolvedValue(
        exampleSprint
      );
      (prismaClient.sprint.update as jest.Mock).mockResolvedValue({
        ...exampleSprint,
        ...updateSprintInput,
      });

      const sprint = await sprintService.updateExistingSprint(
        1,
        updateSprintInput
      );

      expect(prismaClient.sprint.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaClient.sprint.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { ...exampleSprint, ...updateSprintInput },
      });
      expect(sprint).toEqual({ ...exampleSprint, ...updateSprintInput });
    });

    it('should throw an error if sprint not found', async () => {
      (prismaClient.sprint.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        sprintService.updateExistingSprint(1, {
          name: 'Updated Sprint',
          goal: 'Updated goal',
        })
      ).rejects.toThrow('Sprint not found');
    });
  });

  describe('deleteSprintById', () => {
    it('should delete a sprint by ID', async () => {
      (prismaClient.sprint.findUnique as jest.Mock).mockResolvedValue(
        exampleSprint
      );
      (prismaClient.sprint.delete as jest.Mock).mockResolvedValue(
        exampleSprint
      );

      const sprint = await sprintService.deleteSprintById(1);

      expect(prismaClient.sprint.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaClient.sprint.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(sprint).toEqual(exampleSprint);
    });

    it('should throw an error if sprint not found', async () => {
      (prismaClient.sprint.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(sprintService.deleteSprintById(1)).rejects.toThrow(
        'Sprint not found'
      );
    });
  });
});
