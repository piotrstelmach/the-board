import { z } from 'zod';
import { giveRoleInputValidator, newUserInputValidator, updateUserRequestBodyValidator } from '../../validators/user';

export type NewUserInput = z.infer<typeof newUserInputValidator>

export type UpdateUserInput = z.infer<typeof updateUserRequestBodyValidator>

export type GiveRoleInput = z.infer<typeof giveRoleInputValidator>


