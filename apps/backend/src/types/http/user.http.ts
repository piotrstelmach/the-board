import { z } from 'zod';
import { newUserInputValidator, updateUserRequestBodyValidator } from '../../validators/user';
import { newTaskInputValidator, updateTaskRequestBodyValidator } from '../../validators/task';

export type NewUserInput = z.infer<typeof newUserInputValidator>

export type UpdateUserInput = z.infer<typeof updateUserRequestBodyValidator>

export type NewTaskInput = z.infer<typeof newTaskInputValidator>

export type UpdateTaskInput = z.infer<typeof updateTaskRequestBodyValidator>
