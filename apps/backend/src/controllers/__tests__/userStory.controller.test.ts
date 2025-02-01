import { UserStoryController } from '../userStory.controller';
import * as userStoryService from '../../services/userStory.service';
import { Request, Response } from 'express';
import {
  NewUserStoryInput,
  UpdateUserStoryInput,
} from '../../types/http/userStory.http';
import { UserStory } from '@prisma/client';
import {
  ErrorResponse,
  PaginatedResponse,
  TypedRequestBody,
  TypedRequestQueryParams,
} from '../../types/global';
import { PaginationParams } from '../../types/http/pagination.http';

jest.mock('../../services/userStory.service');

describe('UserStoryController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let userStoryController: UserStoryController;

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
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    userStoryController = new UserStoryController();
    jest.clearAllMocks();
  });

  describe('getUserStories', () => {
    it('should return paginated user stories with nextPage cursor', async () => {
      req.query = { page: '1', limit: '10' } as unknown as PaginationParams;
      jest
        .spyOn(userStoryService, 'getUserStories')
        .mockResolvedValue(Array(10).fill(exampleUserStory));

      await userStoryController.getUserStories(
        req as TypedRequestQueryParams<PaginationParams>,
        res as Response<PaginatedResponse<UserStory> | ErrorResponse>
      );

      expect(userStoryService.getUserStories).toHaveBeenCalledWith(1, 10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        items: Array(10).fill(exampleUserStory),
        next: 2,
      });
    });

    it('should return null nextPage cursor if there are no more user stories', async () => {
      req.query = { page: '1', limit: '10' } as unknown as PaginationParams;
      jest.spyOn(userStoryService, 'getUserStories').mockResolvedValue([]);

      await userStoryController.getUserStories(
        req as TypedRequestQueryParams<PaginationParams>,
        res as Response<PaginatedResponse<UserStory> | ErrorResponse>
      );

      expect(userStoryService.getUserStories).toHaveBeenCalledWith(1, 10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ items: [], next: null });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      req.query = { page: '1', limit: '10' } as unknown as PaginationParams;
      jest.spyOn(userStoryService, 'getUserStories').mockRejectedValue(error);

      await userStoryController.getUserStories(
        req as TypedRequestQueryParams<PaginationParams>,
        res as Response<PaginatedResponse<UserStory> | ErrorResponse>
      );

      expect(userStoryService.getUserStories).toHaveBeenCalledWith(1, 10);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getSingleUserStory', () => {
    it('should return a user story by ID', async () => {
      req.params = { userStoryId: '1' };
      jest
        .spyOn(userStoryService, 'getSingleUserStory')
        .mockResolvedValue(exampleUserStory);

      await userStoryController.getSingleUserStory(
        req as Request,
        res as Response
      );

      expect(userStoryService.getSingleUserStory).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(exampleUserStory);
    });

    it('should return 400 if userStoryId is not provided', async () => {
      await userStoryController.getSingleUserStory(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'User story ID is required',
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      req.params = { userStoryId: '1' };
      jest
        .spyOn(userStoryService, 'getSingleUserStory')
        .mockRejectedValue(error);

      await userStoryController.getSingleUserStory(
        req as Request,
        res as Response
      );

      expect(userStoryService.getSingleUserStory).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('createUserStory', () => {
    it('should create a new user story', async () => {
      req.body = {
        title: 'User Story 1',
        description: 'Description of user story 1',
      } as NewUserStoryInput;
      jest
        .spyOn(userStoryService, 'createUserStory')
        .mockResolvedValue(exampleUserStory);

      await userStoryController.createUserStory(
        req as TypedRequestBody<NewUserStoryInput>,
        res as Response<UserStory | ErrorResponse>
      );

      expect(userStoryService.createUserStory).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(exampleUserStory);
    });

    it('should return 400 if request body is not provided', async () => {
      await userStoryController.createUserStory(
        req as TypedRequestBody<NewUserStoryInput>,
        res as Response<UserStory | ErrorResponse>
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Request body is required',
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      req.body = {
        title: 'User Story 1',
        description: 'Description of user story 1',
      } as NewUserStoryInput;
      jest.spyOn(userStoryService, 'createUserStory').mockRejectedValue(error);

      await userStoryController.createUserStory(
        req as TypedRequestBody<NewUserStoryInput>,
        res as Response<UserStory | ErrorResponse>
      );

      expect(userStoryService.createUserStory).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('updateUserStory', () => {
    it('should update an existing user story', async () => {
      const updatedUserStory = {
        ...exampleUserStory,
        title: 'Updated User Story',
      };
      req.params = { userStoryId: '1' };
      req.body = {
        title: 'Updated User Story',
        description: 'Updated description',
      } as UpdateUserStoryInput;
      jest
        .spyOn(userStoryService, 'updateUserStory')
        .mockResolvedValue(updatedUserStory);

      await userStoryController.updateUserStory(
        req as TypedRequestBody<UpdateUserStoryInput>,
        res as Response<UserStory | ErrorResponse>
      );

      expect(userStoryService.updateUserStory).toHaveBeenCalledWith(
        1,
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedUserStory);
    });

    it('should return 400 if request body is not provided', async () => {
      req.params = { userStoryId: '1' };
      await userStoryController.updateUserStory(
        req as TypedRequestBody<UpdateUserStoryInput>,
        res as Response<UserStory | ErrorResponse>
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Request body is required',
      });
    });

    it('should return 400 if userStoryId is not provided', async () => {
      req.body = {
        title: 'Updated User Story',
        description: 'Updated description',
      } as UpdateUserStoryInput;
      await userStoryController.updateUserStory(
        req as TypedRequestBody<UpdateUserStoryInput>,
        res as Response<UserStory | ErrorResponse>
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'User story ID is required',
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      req.params = { userStoryId: '1' };
      req.body = {
        title: 'Updated User Story',
        description: 'Updated description',
      } as UpdateUserStoryInput;
      jest.spyOn(userStoryService, 'updateUserStory').mockRejectedValue(error);

      await userStoryController.updateUserStory(
        req as TypedRequestBody<UpdateUserStoryInput>,
        res as Response<UserStory | ErrorResponse>
      );

      expect(userStoryService.updateUserStory).toHaveBeenCalledWith(
        1,
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('deleteUserStory', () => {
    it('should delete a user story by ID', async () => {
      req.params = { userStoryId: '1' };
      jest
        .spyOn(userStoryService, 'deleteUserStory')
        .mockResolvedValue(exampleUserStory);

      await userStoryController.deleteUserStory(
        req as Request,
        res as Response
      );

      expect(userStoryService.deleteUserStory).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(exampleUserStory);
    });

    it('should return 400 if userStoryId is not provided', async () => {
      await userStoryController.deleteUserStory(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'User story ID is required',
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      req.params = { userStoryId: '1' };
      jest.spyOn(userStoryService, 'deleteUserStory').mockRejectedValue(error);

      await userStoryController.deleteUserStory(
        req as Request,
        res as Response
      );

      expect(userStoryService.deleteUserStory).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});
