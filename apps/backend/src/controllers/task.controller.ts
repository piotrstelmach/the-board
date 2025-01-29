import {
  ErrorResponse,
  TypedRequestBody,
  TypedRequestQueryParams,
} from '../types/global';
import { NewTaskInput, UpdateTaskInput } from '../types/http/task.http';
import { Task } from '@prisma/client';
import { Request, Response } from 'express';
import * as taskService from '../services/task.service';
import { PaginationParams } from '../types/http/pagination.http';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
} from '../config/pagination';

export class TaskController {
  async createTask(
    req: TypedRequestBody<NewTaskInput>,
    res: Response<Task | ErrorResponse>
  ) {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    try {
      const task = await taskService.createTask(req.body);
      return res.status(201).json(task);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  async getTasks(
    req: TypedRequestQueryParams<PaginationParams>,
    res: Response<Task[] | ErrorResponse>
  ) {
    try {
      const tasks = await taskService.getAllTasks(
        req.query.page ?? DEFAULT_PAGINATION_PAGE,
        req.query.limit ?? DEFAULT_PAGINATION_LIMIT
      );
      return res.status(200).json(tasks);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  async getTaskById(req: Request, res: Response<Task | ErrorResponse>) {
    if (!req.params?.taskId) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    try {
      const task = await taskService.getTaskById(Number(req.params.taskId));
      return res.status(200).json(task);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  async updateTask(
    req: TypedRequestBody<UpdateTaskInput>,
    res: Response<Task | ErrorResponse>
  ) {
    if (!req.params?.taskId) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    try {
      const task = await taskService.updateTask(
        Number(req.params?.taskId),
        req.body
      );
      return res.status(200).json(task);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  async deleteTask(req: Request, res: Response<Task | ErrorResponse>) {
    if (!req.params?.taskId) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    const taskId = Number(req.params.taskId);

    try {
      const task = await taskService.deleteTask(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      } else {
        return res.status(200).json(task);
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
}
