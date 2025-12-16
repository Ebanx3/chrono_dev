import { Router } from "express";
import { ProjectController } from "./controllers";
import { authenticate } from "../../middlewares/authenticate";

const router = Router();

router.post("/", authenticate, ProjectController.createProject);
router.get("/", ProjectController.getProjects);

export default router;
