import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ForgotPasswordController from './app/controllers/ForgotPasswordController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// Public routes
routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);
routes.post('/forgot-my-password', ForgotPasswordController.recover);
routes.post('/update-password', ForgotPasswordController.update);

// Private routes
routes.use(authMiddleware);
routes.put('/users', UserController.update);
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
