import { Router } from "express";
import { ProjectController } from "./controllers";
import { authenticate, authenticateOptional } from "../../middlewares/authenticate";

const router = Router();

router.post("/", authenticate, ProjectController.createProject);
router.get("/", ProjectController.getProjects);
router.get("/:projectId", authenticateOptional, ProjectController.getProjectById);

export default router;
