import { Router } from 'express';
import { AuthenticationController } from '../controllers/authentication.controller';
import { validateRequestInput } from '../middleware/validateRequestInput';
import { LoginUserInput, RegisterUserInput } from '../types/http/authentication.http';
import { checkUserAuthorization } from '../middleware/checkUserAuthorization';
import { loginInputSchema, registerInputSchema } from '../validators/authentication';

const authenticationRouter: Router = Router();
const authenticationController = new AuthenticationController()

authenticationRouter.post('/signup', validateRequestInput<RegisterUserInput>(registerInputSchema), authenticationController.registerUser);
authenticationRouter.post('/login', validateRequestInput<LoginUserInput>(loginInputSchema), authenticationController.loginUser);
authenticationRouter.post('/logout', checkUserAuthorization, authenticationController.logoutUser);
authenticationRouter.post('/refresh-token', checkUserAuthorization, authenticationController.refreshToken);

export { authenticationRouter as authenticationRoutes };