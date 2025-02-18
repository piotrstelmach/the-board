import { SessionUser } from '../types/sessionUser';

export const mapSessionUser = <T extends SessionUser>(user: T): SessionUser => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    roles: user.roles,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
