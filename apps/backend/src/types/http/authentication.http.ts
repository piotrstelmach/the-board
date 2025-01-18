import { z } from 'zod';
import { loginInputSchema, registerInputSchema } from '../../validators/authentication';

export type RegisterUserInput = z.infer<typeof registerInputSchema>;
export type LoginUserInput = z.infer<typeof loginInputSchema>;