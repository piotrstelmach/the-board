import { Router } from 'express';
import { AuthenticationController } from '../controllers/authentication.controller';
import { validateRequestInput } from '../middleware/validateRequestInput';
import { LoginUserInput, RegisterUserInput } from '../types/http/authentication.http';

const authenticationRouter: Router = Router();
const authenticationController = new AuthenticationController()

authenticationRouter.post('/signup', validateRequestInput<RegisterUserInput>, authenticationController.registerUser);
authenticationRouter.post('/login', validateRequestInput<LoginUserInput>, authenticationController.loginUser);
authenticationRouter.post('/logout', authenticationController.logoutUser);

export { authenticationRouter as authenticationRoutes };