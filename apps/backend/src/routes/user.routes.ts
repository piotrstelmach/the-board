import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateRequestInput } from '../middleware/validateRequestInput';
import { NewUserInput, UpdateUserInput } from '../types/http/user.http';
import { newUserInputValidator, updateUserRequestBodyValidator } from '../validators/user';
import { checkUserAuthorization } from '../middleware/checkUserAuthorization';

const userRouter: Router = Router();
const userController = new UserController();

userRouter.get('/', checkUserAuthorization, userController.getUsers);
userRouter.get('/:userId', checkUserAuthorization, userController.getSingleUser);
userRouter.post('/', checkUserAuthorization, validateRequestInput<NewUserInput>(newUserInputValidator), userController.createUser);
userRouter.put('/:userId', checkUserAuthorization, validateRequestInput<UpdateUserInput>(updateUserRequestBodyValidator), userController.updateUser);
userRouter.delete('/:userId', checkUserAuthorization, userController.deleteUser);

export { userRouter as userRoutes };