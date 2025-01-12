import { ErrorResponse, TypedRequestBody } from '../types/global';
import { NewUserInput, UpdateUserInput } from '../types/http/user.http';
import { Request, Response } from 'express';
import {
  createNewUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateExistingUser,
} from '../services/user.service';
import { User } from '@prisma/client';

export class UserController {
  async getUsers(_req: Request, res: Response<User[] | ErrorResponse>) {
    try {
      const users = await getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async getSingleUser(req: Request, res: Response<User | ErrorResponse>) {
    if (!req.params.userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    try {
      const user = await getUserById(Number(req.params.userId));
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async createUser(
    req: TypedRequestBody<NewUserInput>,
    res: Response<User | ErrorResponse>
  ) {
    if (!req.body) {
      res.status(400).json({ error: 'Request body is required' });
      return;
    }

    try {
      const user = await createNewUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async updateUser(
    req: TypedRequestBody<UpdateUserInput>,
    res: Response<User | ErrorResponse>
  ) {
    if (!req.params.userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    try {
      const user = await updateExistingUser(req.body.id, req.body);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async deleteUser(req: Request, res: Response<User | ErrorResponse>) {
    if (!req.params.userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    try {
      const user = await deleteUserById(req.body.id);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
}
