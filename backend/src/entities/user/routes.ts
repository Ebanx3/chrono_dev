import { Router } from "express";
import { AuthController } from "./auth.controller";
import { UserController } from "./controller";
import { mustBeAuthenticated } from "../../middlewares/mustBeAuthenticated";

const router = Router();

//Auth routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/verify_email', AuthController.verifiyEmail)

//User routes
router.get('/cloudinary_signature', mustBeAuthenticated, UserController.getCloudinarySignature);
router.get('/:userId', UserController.getUserById);
router.get('/', UserController.getAllUsers);
router.patch('/', mustBeAuthenticated, UserController.updateUser);

export default router;