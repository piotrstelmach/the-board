import { prismaClient } from '../../utils/database';
import { Task } from '@prisma/client';
import { NewTaskInput, UpdateTaskInput } from '../../types/http/task.http';
import * as taskService from '../task.service';
import { redisClient } from '../../utils/redisClient';
import { mapRedisHash, saveToRedisHash } from '../../utils/redisCache';

jest.mock('../../utils/database', () => ({
  prismaClient: {
    task: {
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

describe('TaskService', () => {
  const exampleTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'This is a test task',
    status: 'TODO',
    priority: 'LOW',
    storyPoints: 1,
    assigneeId: 1,
    sprintId: null,
    storyId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTasks', () => {
    it('should return all tasks from cache', async () => {
      (redisClient.hGetAll as jest.Mock).mockResolvedValue({
        '0': JSON.stringify(exampleTask),
      });
      (mapRedisHash as jest.Mock).mockReturnValue([exampleTask]);

      const tasks = await taskService.getAllTasks(1, 10);

      expect(redisClient.hGetAll).toHaveBeenCalledWith(
        'pagination:task:page1limit:10'
      );
      expect(mapRedisHash).toHaveBeenCalled();
      expect(tasks).toEqual([exampleTask]);
    });

    it('should return all tasks from database and cache them', async () => {
      (redisClient.hGetAll as jest.Mock).mockResolvedValue({});
      (prismaClient.task.findMany as jest.Mock).mockResolvedValue([
        exampleTask,
      ]);
      (saveToRedisHash as jest.Mock).mockReturnValue({
        '0': JSON.stringify(exampleTask),
      });

      const tasks = await taskService.getAllTasks(1, 10);

      expect(redisClient.hGetAll).toHaveBeenCalledWith(
        'pagination:task:page1limit:10'
      );
      expect(prismaClient.task.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(redisClient.hSet).toHaveBeenCalledWith(
        'pagination:task:page1limit:10',
        expect.any(Object)
      );
      expect(tasks).toEqual([exampleTask]);
    });

    it('should throw an error if fetching tasks fails', async () => {
      (redisClient.hGetAll as jest.Mock).mockRejectedValue(
        new Error('Error fetching tasks')
      );

      await expect(taskService.getAllTasks(1, 10)).rejects.toThrow(
        'Error fetching tasks'
      );
    });
  });

  describe('getTaskById', () => {
    it('should return a task by ID from cache', async () => {
      (redisClient.hGetAll as jest.Mock).mockResolvedValue({
        id: '1',
        title: 'Test Task',
        description: 'This is a test task',
        status: 'TODO',
        priority: 'LOW',
        storyPoints: '1',
        assigneeId: '1',
        sprintId: null,
        storyId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      (mapRedisHash as jest.Mock).mockReturnValue(exampleTask);

      const task = await taskService.getTaskById(1);

      expect(redisClient.hGetAll).toHaveBeenCalledWith('task:1');
      expect(mapRedisHash).toHaveBeenCalled();
      expect(task).toEqual(exampleTask);
    });

    it('should return a task by ID from database and cache it', async () => {
      (redisClient.hGetAll as jest.Mock).mockResolvedValue({});
      (prismaClient.task.findUnique as jest.Mock).mockResolvedValue(
        exampleTask
      );

      const task = await taskService.getTaskById(1);

      expect(redisClient.hGetAll).toHaveBeenCalledWith('task:1');
      expect(prismaClient.task.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(task).toEqual(exampleTask);
    });

    it('should throw an error if task not found', async () => {
      (redisClient.hGetAll as jest.Mock).mockResolvedValue({});
      (prismaClient.task.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(taskService.getTaskById(1)).rejects.toThrow(
        'Task not found'
      );
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const newTaskInput: NewTaskInput = {
        title: 'Test Task',
        description: 'This is a test task',
        userId: 1,
      };
      (prismaClient.task.create as jest.Mock).mockResolvedValue(exampleTask);

      const task = await taskService.createTask(newTaskInput);

      expect(prismaClient.task.create).toHaveBeenCalledWith({
        data: newTaskInput,
      });
      expect(task).toEqual(exampleTask);
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const updateTaskInput: UpdateTaskInput = {
        title: 'Updated Task',
        description: 'Updated description',
      };
      (prismaClient.task.findUnique as jest.Mock).mockResolvedValue(
        exampleTask
      );
      (prismaClient.task.update as jest.Mock).mockResolvedValue({
        ...exampleTask,
        ...updateTaskInput,
      });

      const task = await taskService.updateTask(1, updateTaskInput);

      expect(prismaClient.task.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaClient.task.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { ...exampleTask, ...updateTaskInput },
      });
      expect(task).toEqual({ ...exampleTask, ...updateTaskInput });
    });

    it('should throw an error if task not found', async () => {
      (prismaClient.task.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        taskService.updateTask(1, {
          title: 'Updated Task',
          description: 'Updated description',
        })
      ).rejects.toThrow('Task not found');
    });
  });

  describe('deleteTask', () => {
    it('should delete a task by ID', async () => {
      (prismaClient.task.findUnique as jest.Mock).mockResolvedValue(
        exampleTask
      );
      (prismaClient.task.delete as jest.Mock).mockResolvedValue(exampleTask);

      const task = await taskService.deleteTask(1);

      expect(prismaClient.task.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaClient.task.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(task).toEqual(exampleTask);
    });

    it('should throw an error if task not found', async () => {
      (prismaClient.task.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(taskService.deleteTask(1)).rejects.toThrow('Task not found');
    });
  });
});
