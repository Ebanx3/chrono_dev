import { Router } from "express";
import { UserController } from "./controller";

const router = Router();

router.post('/register', UserController.register);

export default router;