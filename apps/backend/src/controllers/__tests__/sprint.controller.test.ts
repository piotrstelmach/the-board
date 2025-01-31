import { SprintController } from '../sprint.controller';
import * as sprintService from '../../services/sprint.service';
import { Request, Response } from 'express';
import {
  NewSprintInput,
  UpdateSprintInput,
} from '../../types/http/sprint.http';
import { Sprint } from '@prisma/client';
import {
  ErrorResponse,
  TypedRequestBody,
  TypedRequestQueryParams,
} from '../../types/global';
import { PaginationParams } from '../../types/http/pagination.http';

describe('SprintController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  const exampleSprint: Sprint = {
    id: 1,
    name: 'Sprint 1',
    goal: 'Complete tasks',
    totalPoints: 20,
    startDate: new Date(),
    endDate: new Date(),
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

  describe('getSprints', () => {
    it('should return all sprints', async () => {
      req.query = { page: '1', limit: '10' } as unknown as PaginationParams;
      jest
        .spyOn(sprintService, 'getAllSprints')
        .mockResolvedValue([exampleSprint]);

      const sprintController = new SprintController();
      await sprintController.getSprints(
        req as TypedRequestQueryParams<PaginationParams>,
        res as Response
      );

      expect(sprintService.getAllSprints).toHaveBeenCalledWith(10, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([exampleSprint]);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      req.query = { page: '1', limit: '10' } as unknown as PaginationParams;
      jest.spyOn(sprintService, 'getAllSprints').mockRejectedValue(error);

      const sprintController = new SprintController();
      await sprintController.getSprints(
        req as TypedRequestQueryParams<PaginationParams>,
        res as Response
      );

      expect(sprintService.getAllSprints).toHaveBeenCalledWith(10, 1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getSingleSprint', () => {
    it('should return a sprint by ID', async () => {
      req.params = { sprintId: '1' };
      jest
        .spyOn(sprintService, 'getSprintById')
        .mockResolvedValue(exampleSprint);

      const sprintController = new SprintController();
      await sprintController.getSingleSprint(req as Request, res as Response);

      expect(sprintService.getSprintById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(exampleSprint);
    });

    it('should return 400 if sprintId is not provided', async () => {
      const sprintController = new SprintController();
      await sprintController.getSingleSprint(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Sprint ID is required' });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      req.params = { sprintId: '1' };
      jest.spyOn(sprintService, 'getSprintById').mockRejectedValue(error);

      const sprintController = new SprintController();
      await sprintController.getSingleSprint(req as Request, res as Response);

      expect(sprintService.getSprintById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('createSprint', () => {
    it('should create a new sprint', async () => {
      req.body = {
        name: 'Sprint 1',
        goal: 'Complete tasks',
        startDate: new Date().toString(),
        endDate: new Date().toString(),
      } as NewSprintInput;
      jest
        .spyOn(sprintService, 'createNewSprint')
        .mockResolvedValue(exampleSprint);

      const sprintController = new SprintController();
      await sprintController.createSprint(
        req as TypedRequestBody<NewSprintInput>,
        res as Response<Sprint | ErrorResponse>
      );

      expect(sprintService.createNewSprint).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(exampleSprint);
    });

    it('should return 400 if request body is not provided', async () => {
      const sprintController = new SprintController();
      await sprintController.createSprint(
        req as TypedRequestBody<NewSprintInput>,
        res as Response<Sprint | ErrorResponse>
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Request body is required',
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      req.body = {
        name: 'Sprint 1',
        goal: 'Complete tasks',
        startDate: new Date().toString(),
        endDate: new Date().toString(),
      } as NewSprintInput;
      jest.spyOn(sprintService, 'createNewSprint').mockRejectedValue(error);

      const sprintController = new SprintController();
      await sprintController.createSprint(
        req as TypedRequestBody<NewSprintInput>,
        res as Response<Sprint | ErrorResponse>
      );

      expect(sprintService.createNewSprint).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('updateSprint', () => {
    it('should update an existing sprint', async () => {
      const updatedSprint = { ...exampleSprint, name: 'Updated Sprint' };
      req.params = { sprintId: '1' };
      req.body = {
        name: 'Updated Sprint',
        goal: 'Updated goal',
      } as UpdateSprintInput;
      jest
        .spyOn(sprintService, 'updateExistingSprint')
        .mockResolvedValue(updatedSprint);

      const sprintController = new SprintController();
      await sprintController.updateSprint(
        req as TypedRequestBody<UpdateSprintInput>,
        res as Response<Sprint | ErrorResponse>
      );

      expect(sprintService.updateExistingSprint).toHaveBeenCalledWith(
        1,
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedSprint);
    });

    it('should return 400 if request body is not provided', async () => {
      req.params = { sprintId: '1' };
      const sprintController = new SprintController();
      await sprintController.updateSprint(
        req as TypedRequestBody<UpdateSprintInput>,
        res as Response<Sprint | ErrorResponse>
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Request body is required',
      });
    });

    it('should return 400 if sprintId is not provided', async () => {
      req.body = {
        name: 'Updated Sprint',
        goal: 'Updated goal',
      } as UpdateSprintInput;
      const sprintController = new SprintController();
      await sprintController.updateSprint(
        req as TypedRequestBody<UpdateSprintInput>,
        res as Response<Sprint | ErrorResponse>
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Sprint ID is required' });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      req.params = { sprintId: '1' };
      req.body = {
        name: 'Updated Sprint',
        goal: 'Updated goal',
      } as UpdateSprintInput;
      jest
        .spyOn(sprintService, 'updateExistingSprint')
        .mockRejectedValue(error);

      const sprintController = new SprintController();
      await sprintController.updateSprint(
        req as TypedRequestBody<UpdateSprintInput>,
        res as Response<Sprint | ErrorResponse>
      );

      expect(sprintService.updateExistingSprint).toHaveBeenCalledWith(
        1,
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('deleteSprint', () => {
    it('should delete a sprint by ID', async () => {
      req.params = { sprintId: '1' };
      jest
        .spyOn(sprintService, 'deleteSprintById')
        .mockResolvedValue(exampleSprint);

      const sprintController = new SprintController();
      await sprintController.deleteSprint(req as Request, res as Response);

      expect(sprintService.deleteSprintById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 400 if sprintId is not provided', async () => {
      const sprintController = new SprintController();
      await sprintController.deleteSprint(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Sprint ID is required' });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      req.params = { sprintId: '1' };
      jest.spyOn(sprintService, 'deleteSprintById').mockRejectedValue(error);

      const sprintController = new SprintController();
      await sprintController.deleteSprint(req as Request, res as Response);

      expect(sprintService.deleteSprintById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});
