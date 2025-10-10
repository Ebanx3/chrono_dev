import { Router } from "express";
import { UserController } from "./controller";

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/verify_email', UserController.verifiyEmail)

export default router;