import { LoginResponse } from '../features/authorization/types/validation/loginResponse';
import { LoggedUser } from '../types/loggedUser';

export const mapLoggedUser = (user: LoginResponse): LoggedUser => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    roles: user.roles,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
