import { z } from 'zod';
import { newUserInputValidator, updateUserRequestBodyValidator } from '../../validators/user';

export type NewUserInput = z.infer<typeof newUserInputValidator>

export type UpdateUserInput = z.infer<typeof updateUserRequestBodyValidator>


