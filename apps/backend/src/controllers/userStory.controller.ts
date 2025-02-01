import { Request, Response } from 'express';
import * as userStoryService from '../services/userStory.service';
import {
  ErrorResponse,
  PaginatedResponse,
  TypedRequestBody,
  TypedRequestQueryParams,
} from '../types/global';
import {
  NewUserStoryInput,
  UpdateUserStoryInput,
} from '../types/http/userStory.http';
import { UserStory } from '@prisma/client';
import { PaginationParams } from '../types/http/pagination.http';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
} from '../config/pagination';

export class UserStoryController {
  async getUserStories(
    req: TypedRequestQueryParams<PaginationParams>,
    res: Response<PaginatedResponse<UserStory> | ErrorResponse>
  ) {
    try {
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);

      const userStories = await userStoryService.getUserStories(
        page ?? DEFAULT_PAGINATION_PAGE,
        limit ?? DEFAULT_PAGINATION_LIMIT
      );

      const nextPage = userStories?.length === limit ? page + 1 : null;

      return res.status(200).json({ items: userStories, next: nextPage });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  async getSingleUserStory(
    req: Request,
    res: Response<UserStory | ErrorResponse>
  ) {
    if (!req.params?.userStoryId) {
      return res.status(400).json({ error: 'User story ID is required' });
    }
    try {
      const userStory = await userStoryService.getSingleUserStory(
        Number(req.params.userStoryId)
      );
      return res.status(200).json(userStory);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  async createUserStory(
    req: TypedRequestBody<NewUserStoryInput>,
    res: Response<UserStory | ErrorResponse>
  ) {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    try {
      const userStory = await userStoryService.createUserStory(req.body);
      return res.status(201).json(userStory);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  async updateUserStory(
    req: TypedRequestBody<UpdateUserStoryInput>,
    res: Response<UserStory | ErrorResponse>
  ) {
    if (!req.params?.userStoryId) {
      return res.status(400).json({ error: 'User story ID is required' });
    }

    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    try {
      const userStory = await userStoryService.updateUserStory(
        Number(req.params.userStoryId),
        req.body
      );
      return res.status(200).json(userStory);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  async deleteUserStory(
    req: Request,
    res: Response<UserStory | ErrorResponse>
  ) {
    if (!req.params?.userStoryId) {
      return res.status(400).json({ error: 'User story ID is required' });
    }

    try {
      const userStory = await userStoryService.deleteUserStory(
        Number(req.params.userStoryId)
      );
      return res.status(200).json(userStory);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
}
