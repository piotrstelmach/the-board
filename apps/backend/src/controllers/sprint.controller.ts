import * as sprintService from '../services/sprint.service';
import { ErrorResponse, TypedRequestBody } from '../types/global';
import { Request, Response } from 'express'
import { Sprint } from '@prisma/client';
import { NewSprintInput, UpdateSprintInput } from '../types/http/sprint.http';

export class SprintController {
  async getSprints(_req: Request, res: Response<Sprint[] | ErrorResponse>) {
    try {
      const sprints = await sprintService.getAllSprints();
      return res.status(200).json(sprints);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  async getSingleSprint(req: Request, res: Response<Sprint | ErrorResponse>) {
    if(!req.params?.sprintId) {
      return res.status(400).json({ error: 'Sprint ID is required' });
    }

    try {
      const sprint = await sprintService.getSprintById(Number(req.params.sprintId));
      return res.status(200).json(sprint);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  async createSprint(req: TypedRequestBody<NewSprintInput>, res: Response<Sprint | ErrorResponse>) {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    try {
      const sprint = await sprintService.createNewSprint(req.body);
      return res.status(201).json(sprint);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  async updateSprint(req: TypedRequestBody<UpdateSprintInput>, res: Response<Sprint | ErrorResponse>) {
    if (!req.params?.sprintId) {
      return res.status(400).json({ error: 'Sprint ID is required' });
    }

    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    try {
      const sprint = await sprintService.updateExistingSprint(Number(req.params.sprintId), req.body);
      return res.status(200).json(sprint);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  async deleteSprint(req: Request, res: Response<ErrorResponse>) {
    if (!req.params?.sprintId) {
      return res.status(400).json({ error: 'Sprint ID is required' });
    }

    try {
      await sprintService.deleteSprintById(Number(req.params.sprintId));
      return res.status(204).json();
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
}