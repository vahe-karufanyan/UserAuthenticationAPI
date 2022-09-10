import express from 'express';
import { createUserHandler, getCurrentUserHandler, verifyUserHandler } from '../controller/user.controller';
import validateResource from '../middleware/validateResource';
import { createUserSchema, verifyUserSchema } from '../schema/user.schema';

const router = express.Router();

router.post("/api/users", validateResource(createUserSchema), createUserHandler);
router.post("/api/users/verify/:id/:verificationCode", validateResource(verifyUserSchema), verifyUserHandler);
router.get('/api/users/me', getCurrentUserHandler);

export default router;