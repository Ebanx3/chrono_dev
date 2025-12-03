import { Router } from "express";
import { AuthController } from "./auth.controller";
import { UserController } from "./controller";

const router = Router();

//Auth routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/verify_email', AuthController.verifiyEmail)

//User routes
router.get('/:userId', UserController.getUserById);
router.get('/', UserController.getAllUsers);

export default router;