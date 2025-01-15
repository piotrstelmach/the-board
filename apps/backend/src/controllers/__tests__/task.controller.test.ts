import { TaskController } from '../task.controller';
import * as taskService from '../../services/task.service';
import { Request, Response } from 'express';
import { NewTaskInput, UpdateTaskInput } from '../../types/http/task.http';
import { Task, TaskPriority, TaskStatus } from '@prisma/client';
import { ErrorResponse, TypedRequestBody } from '../../types/global';

describe('TaskController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  const exampleTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'This is a test task',
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    storyPoints: 1,
    assigneeId: 1,
    sprintId: null,
    storyId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });


  describe('createTask', () => {
    it('should create a new task', async () => {
      req.body = { title: 'Test Task', description: 'This is a test task', userId: 1 } as NewTaskInput;
      jest.spyOn(taskService, 'createTask').mockResolvedValue(exampleTask);

      const taskController = new TaskController();
      await taskController.createTask(req as TypedRequestBody<NewTaskInput>, res as Response<Task | ErrorResponse>);

      expect(taskService.createTask).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(exampleTask);
    });

    it('should return 400 if request body is not provided', async () => {
      const taskController = new TaskController();
      await taskController.createTask(req as TypedRequestBody<NewTaskInput>, res as Response<Task | ErrorResponse>);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Request body is required' });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      req.body = { title: 'Test Task', description: 'This is a test task', userId: 1 } as NewTaskInput;
      jest.spyOn(taskService, 'createTask').mockRejectedValue(error);

      const taskController = new TaskController();
      await taskController.createTask(req as TypedRequestBody<NewTaskInput>, res as Response<Task | ErrorResponse>);

      expect(taskService.createTask).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getTasks', () => {
    it('should get all tasks', async () => {
      jest.spyOn(taskService, 'getAllTasks').mockResolvedValue([exampleTask]);

      const taskController = new TaskController();
      await taskController.getTasks(req as Request, res as Response);

      expect(taskService.getAllTasks).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([exampleTask]);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      jest.spyOn(taskService, 'getAllTasks').mockRejectedValue(error);

      const taskController = new TaskController();
      await taskController.getTasks(req as Request, res as Response);

      expect(taskService.getAllTasks).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getTaskById', () => {
    it('should get a task by ID', async () => {
      req.params = { taskId: '1' };
      jest.spyOn(taskService, 'getTaskById').mockResolvedValue(exampleTask);

      const taskController = new TaskController();
      await taskController.getTaskById(req as Request, res as Response);

      expect(taskService.getTaskById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(exampleTask);
    });

    it('should return 400 if taskId is not provided', async () => {
      const taskController = new TaskController();
      await taskController.getTaskById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Task ID is required' });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      req.params = { taskId: '1' };
      jest.spyOn(taskService, 'getTaskById').mockRejectedValue(error);

      const taskController = new TaskController();
      await taskController.getTaskById(req as Request, res as Response);

      expect(taskService.getTaskById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const updatedTask = { ...exampleTask, title: 'Updated Task' };
      req.params = { taskId: '1' };
      req.body = { title: 'Updated Task' } as UpdateTaskInput;
      jest.spyOn(taskService, 'updateTask').mockResolvedValue(updatedTask);

      const taskController = new TaskController();
      await taskController.updateTask(req as TypedRequestBody<UpdateTaskInput>, res as Response<Task | ErrorResponse>);

      expect(taskService.updateTask).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedTask);
    });

    it('should return 400 if request body is not provided', async () => {
      req.params = { taskId: '1' };
      const taskController = new TaskController();
      await taskController.updateTask(req as TypedRequestBody<UpdateTaskInput>, res as Response<Task | ErrorResponse>);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Request body is required' });
    });

    it('should return 400 if taskId is not provided', async () => {
      req.body = { title: 'Updated Task' } as UpdateTaskInput;
      const taskController = new TaskController();
      await taskController.updateTask(req as TypedRequestBody<UpdateTaskInput>, res as Response<Task | ErrorResponse>);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Task ID is required' });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      req.params = { taskId: '1' };
      req.body = { title: 'Updated Task' } as UpdateTaskInput;
      jest.spyOn(taskService, 'updateTask').mockRejectedValue(error);

      const taskController = new TaskController();
      await taskController.updateTask(req as Request, res as Response);

      expect(taskService.updateTask).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task by ID', async () => {
      req.params = { taskId: '1' };
      // jest.spyOn(taskService, 'getTaskById').mockResolvedValue(exampleTask);
      jest.spyOn(taskService, 'deleteTask').mockResolvedValue(exampleTask);

      const taskController = new TaskController();
      await taskController.deleteTask(req as Request, res as Response);

      expect(taskService.getTaskById).toHaveBeenCalledWith(1);
      expect(taskService.deleteTask).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(exampleTask);
    });

    it('should return 400 if taskId is not provided', async () => {
      const taskController = new TaskController();
      await taskController.deleteTask(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Task ID is required' });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      req.params = { taskId: '1' };
      jest.spyOn(taskService, 'deleteTask').mockRejectedValue(error);

      const taskController = new TaskController();
      await taskController.deleteTask(req as Request, res as Response);

      expect(taskService.deleteTask).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});