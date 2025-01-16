import { newSprintInputValidator, updateSprintRequestBodyValidator } from '../../validators/sprint';
import { z } from 'zod';

export type NewSprintInput = z.infer<typeof newSprintInputValidator>

export type UpdateSprintInput = z.infer<typeof updateSprintRequestBodyValidator>