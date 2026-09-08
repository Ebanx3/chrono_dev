import { Router } from "express";
import { ProjectController } from "./controllers";
import { mustBeAuthenticated } from "../../middlewares/mustBeAuthenticated";

const router = Router();

router.post("/", mustBeAuthenticated, ProjectController.createProject);
router.get("/", ProjectController.getProjects);
router.patch("/:projectId/addResource", mustBeAuthenticated, ProjectController.addResourceToProject);
router.get("/:projectId", ProjectController.getProjectById);

export default router;
