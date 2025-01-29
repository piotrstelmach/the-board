import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import {
  validateRequestInput,
  validateRequestParams,
} from '../middleware/validateRequestInput';
import {
  GiveRoleInput,
  NewUserInput,
  UpdateUserInput,
} from '../types/http/user.http';
import {
  giveRoleInputValidator,
  newUserInputValidator,
  updateUserRequestBodyValidator,
} from '../validators/user';
import { checkUserAuthorization } from '../middleware/checkUserAuthorization';
import { paginationValidator } from '../validators/pagination';

const userRouter: Router = Router();
const userController = new UserController();

userRouter.get(
  '/',
  validateRequestParams(paginationValidator),
  checkUserAuthorization,
  userController.getUsers
);
userRouter.get(
  '/:userId',
  checkUserAuthorization,
  userController.getSingleUser
);
userRouter.post(
  '/',
  checkUserAuthorization,
  validateRequestInput<NewUserInput>(newUserInputValidator),
  userController.createUser
);
userRouter.put(
  '/:userId',
  checkUserAuthorization,
  validateRequestInput<UpdateUserInput>(updateUserRequestBodyValidator),
  userController.updateUser
);
userRouter.delete(
  '/:userId',
  checkUserAuthorization,
  userController.deleteUser
);
userRouter.put(
  '/:userId/role',
  checkUserAuthorization,
  validateRequestInput<GiveRoleInput>(giveRoleInputValidator),
  userController.giveUserRole
);

export { userRouter as userRoutes };
