import {
  ErrorResponse,
  PaginatedResponse,
  ResultUser,
  TypedRequestBody,
  TypedRequestQueryParams,
} from '../types/global';
import {
  GiveRoleInput,
  NewUserInput,
  UpdateUserInput,
} from '../types/http/user.http';
import { Request, Response } from 'express';
import {
  changeUserRole,
  createNewUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateExistingUser,
} from '../services/user.service';
import { PaginationParams } from '../types/http/pagination.http';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
} from '../config/pagination';

export class UserController {
  async getUsers(
    req: TypedRequestQueryParams<PaginationParams>,
    res: Response<PaginatedResponse<ResultUser> | ErrorResponse>
  ) {
    try {
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);

      const users = await getAllUsers(
        page ?? DEFAULT_PAGINATION_PAGE,
        limit ?? DEFAULT_PAGINATION_LIMIT
      );

      const nextPage = users?.length === limit ? page + 1 : null;

      return res.status(200).json({ items: users, next: nextPage });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  async getSingleUser(req: Request, res: Response<ResultUser | ErrorResponse>) {
    if (!req.params?.userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    try {
      const user = await getUserById(Number(req.params.userId));
      return res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  async createUser(
    req: TypedRequestBody<NewUserInput>,
    res: Response<ResultUser | ErrorResponse>
  ) {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    try {
      const user = await createNewUser(req.body);
      return res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  async updateUser(
    req: TypedRequestBody<UpdateUserInput>,
    res: Response<ResultUser | ErrorResponse>
  ) {
    if (!req.params?.userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!req?.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    try {
      const user = await updateExistingUser(
        Number(req.params.userId),
        req.body
      );
      return res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  async deleteUser(req: Request, res: Response<ResultUser | ErrorResponse>) {
    if (!req.params?.userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      const user = await deleteUserById(Number(req.params.userId));
      return res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  async giveUserRole(
    req: TypedRequestBody<GiveRoleInput>,
    res: Response<ResultUser | ErrorResponse>
  ) {
    try {
      if (!req.params?.userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      if (!req.body.roles) {
        return res.status(400).json({ error: 'Roles are required' });
      }

      const updatedUser = await changeUserRole(
        Number(req.params?.userId),
        req.body.roles
      );
      return res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
}
