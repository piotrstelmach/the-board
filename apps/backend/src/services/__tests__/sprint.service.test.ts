import { prismaClient } from '../../utils/database';
import { Sprint } from '@prisma/client';
import * as sprintService from '../sprint.service';

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

  describe('getAllSprints', () => {
    it('should return all sprints', async () => {
      (prismaClient.sprint.findMany as jest.Mock).mockResolvedValue([exampleSprint]);

      const sprints = await sprintService.getAllSprints();

      expect(prismaClient.sprint.findMany).toHaveBeenCalled();
      expect(sprints).toEqual([exampleSprint]);
    });
  });

  describe('getSprintById', () => {
    it('should return a sprint by ID', async () => {
      (prismaClient.sprint.findUnique as jest.Mock).mockResolvedValue(exampleSprint);

      const sprint = await sprintService.getSprintById(1);

      expect(prismaClient.sprint.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(sprint).toEqual(exampleSprint);
    });

    it('should throw an error if sprint not found', async () => {
      (prismaClient.sprint.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(sprintService.getSprintById(1)).rejects.toThrow('Sprint not found');
    });
  });

  describe('createNewSprint', () => {
    it('should create a new sprint', async () => {
      const newSprintInput = { name: 'Sprint 1', goal: 'Complete tasks', startDate: new Date(), endDate: new Date() };
      (prismaClient.sprint.create as jest.Mock).mockResolvedValue(exampleSprint);

      const sprint = await sprintService.createNewSprint(newSprintInput);

      expect(prismaClient.sprint.create).toHaveBeenCalledWith({ data: newSprintInput });
      expect(sprint).toEqual(exampleSprint);
    });
  });

  describe('updateExistingSprint', () => {
    it('should update an existing sprint', async () => {
      const updateSprintInput = { name: 'Updated Sprint', goal: 'Updated goal' };
      (prismaClient.sprint.findUnique as jest.Mock).mockResolvedValue(exampleSprint);
      (prismaClient.sprint.update as jest.Mock).mockResolvedValue({ ...exampleSprint, ...updateSprintInput });

      const sprint = await sprintService.updateExistingSprint(1, updateSprintInput);

      expect(prismaClient.sprint.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prismaClient.sprint.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { ...exampleSprint, ...updateSprintInput } });
      expect(sprint).toEqual({ ...exampleSprint, ...updateSprintInput });
    });

    it('should throw an error if sprint not found', async () => {
      (prismaClient.sprint.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(sprintService.updateExistingSprint(1, { name: 'Updated Sprint', goal: 'Updated goal' })).rejects.toThrow('Sprint not found');
    });
  });

  describe('deleteSprintById', () => {
    it('should delete a sprint by ID', async () => {
      (prismaClient.sprint.findUnique as jest.Mock).mockResolvedValue(exampleSprint);
      (prismaClient.sprint.delete as jest.Mock).mockResolvedValue(exampleSprint);

      const sprint = await sprintService.deleteSprintById(1);

      expect(prismaClient.sprint.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prismaClient.sprint.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(sprint).toEqual(exampleSprint);
    });

    it('should throw an error if sprint not found', async () => {
      (prismaClient.sprint.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(sprintService.deleteSprintById(1)).rejects.toThrow('Sprint not found');
    });
  });
});