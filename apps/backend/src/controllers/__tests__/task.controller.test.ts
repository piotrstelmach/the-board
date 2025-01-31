import { Request, Response } from 'express';
import { TaskController } from '../task.controller';
import * as taskService from '../../services/task.service';
import { Task, TaskStatus } from '@prisma/client';
import { TypedRequestBody, TypedRequestQueryParams } from '../../types/global';
import { PaginationParams } from '../../types/http/pagination.http';
import { NewTaskInput, UpdateTaskInput } from '../../types/http/task.http';

jest.mock('../../services/task.service');

describe('TaskController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let taskController: TaskController;

  const exampleTask: Task = {
    id: 1,
    title: 'Task 1',
    description: 'Description of task 1',
    status: TaskStatus.TODO,
    storyPoints: 0,
    assigneeId: 0,
    sprintId: 0,
    storyId: 0,
    priority: 'HIGH',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    taskController = new TaskController();
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      req.body = exampleTask;
      (taskService.createTask as jest.Mock).mockResolvedValue(exampleTask);

      await taskController.createTask(
        req as TypedRequestBody<NewTaskInput>,
        res as Response
      );

      expect(taskService.createTask).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(exampleTask);
    });

    it('should handle missing request body', async () => {
      req.body = undefined;

      await taskController.createTask(
        req as TypedRequestBody<NewTaskInput>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Request body is required',
      });
    });

    it('should handle errors', async () => {
      req.body = exampleTask;
      (taskService.createTask as jest.Mock).mockRejectedValue(
        new Error('Error')
      );

      await taskController.createTask(
        req as TypedRequestBody<NewTaskInput>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
    });
  });

  describe('getTasks', () => {
    it('should return all tasks', async () => {
      req.query = { page: '1', limit: '10' } as unknown as PaginationParams;
      (taskService.getAllTasks as jest.Mock).mockResolvedValue([exampleTask]);

      await taskController.getTasks(
        req as TypedRequestQueryParams<PaginationParams>,
        res as Response
      );

      expect(taskService.getAllTasks).toHaveBeenCalledWith(1, 10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([exampleTask]);
    });

    it('should handle errors', async () => {
      req.query = { page: '1', limit: '10' } as unknown as PaginationParams;
      (taskService.getAllTasks as jest.Mock).mockRejectedValue(
        new Error('Error')
      );

      await taskController.getTasks(
        req as TypedRequestQueryParams<PaginationParams>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
    });
  });

  describe('getTaskById', () => {
    it('should return a task by ID', async () => {
      req.params = { taskId: '1' };
      (taskService.getTaskById as jest.Mock).mockResolvedValue(exampleTask);

      await taskController.getTaskById(req as Request, res as Response);

      expect(taskService.getTaskById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(exampleTask);
    });

    it('should handle missing taskId', async () => {
      req.params = {};

      await taskController.getTaskById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Task ID is required' });
    });

    it('should handle errors', async () => {
      req.params = { taskId: '1' };
      (taskService.getTaskById as jest.Mock).mockRejectedValue(
        new Error('Error')
      );

      await taskController.getTaskById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      req.params = { taskId: '1' };
      req.body = { title: 'Updated Task' };
      const updatedTask = { ...exampleTask, ...req.body };
      (taskService.updateTask as jest.Mock).mockResolvedValue(updatedTask);

      await taskController.updateTask(
        req as TypedRequestBody<UpdateTaskInput>,
        res as Response
      );

      expect(taskService.updateTask).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedTask);
    });

    it('should handle missing taskId', async () => {
      req.params = {};

      await taskController.updateTask(
        req as TypedRequestBody<UpdateTaskInput>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Task ID is required' });
    });

    it('should handle missing request body', async () => {
      req.params = { taskId: '1' };
      req.body = undefined;

      await taskController.updateTask(
        req as TypedRequestBody<UpdateTaskInput>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Request body is required',
      });
    });

    it('should handle errors', async () => {
      req.params = { taskId: '1' };
      req.body = { title: 'Updated Task' };
      (taskService.updateTask as jest.Mock).mockRejectedValue(
        new Error('Error')
      );

      await taskController.updateTask(
        req as TypedRequestBody<UpdateTaskInput>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task by ID', async () => {
      req.params = { taskId: '1' };
      (taskService.deleteTask as jest.Mock).mockResolvedValue(exampleTask);

      await taskController.deleteTask(req as Request, res as Response);

      expect(taskService.deleteTask).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(exampleTask);
    });

    it('should handle missing taskId', async () => {
      req.params = {};

      await taskController.deleteTask(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Task ID is required' });
    });

    it('should handle errors', async () => {
      req.params = { taskId: '1' };
      (taskService.deleteTask as jest.Mock).mockRejectedValue(
        new Error('Error')
      );

      await taskController.deleteTask(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
    });
  });
});
