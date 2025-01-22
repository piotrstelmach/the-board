import bcrypt from 'bcrypt';
import { saltRounds } from '../config/passwd';

export const hashPassword: (originalPassword: string) => Promise<string> = async (
  originalPassword: string
) => {
  return await bcrypt.hash(originalPassword, saltRounds);
};