import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateRequestInput } from '../middleware/validateRequestInput';
import { NewUserInput, UpdateUserInput } from '../types/http/user.http';
import { newUserInputValidator, updateUserRequestBodyValidator } from '../validators/user';

const userRouter: Router = Router();
const userController = new UserController();

userRouter.get('/', userController.getUsers);
userRouter.get('/:userId', userController.getSingleUser);
userRouter.post('/', validateRequestInput<NewUserInput>(newUserInputValidator), userController.createUser);
userRouter.put('/:userId', validateRequestInput<UpdateUserInput>(updateUserRequestBodyValidator), userController.updateUser);
userRouter.delete('/:userId', userController.deleteUser);

export { userRouter as userRoutes };