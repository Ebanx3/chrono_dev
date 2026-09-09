import { Router } from "express";
import { ProjectController } from "./controllers";
import { mustBeAuthenticated } from "../../middlewares/mustBeAuthenticated";

const router = Router();

router.post("/", mustBeAuthenticated, ProjectController.createProject);
router.get("/", ProjectController.getProjects);
router.patch("/:projectId/addResource", mustBeAuthenticated, ProjectController.addResourceToProject);
router.patch("/:projectId/joinAsPendingMember",mustBeAuthenticated, ProjectController.joinAsPendingMember);
router.patch("/:projectId/joinAsMember",mustBeAuthenticated, ProjectController.joinAsMember);
router.patch("/:projectId/acceptPendingMember/:userId", mustBeAuthenticated, ProjectController.acceptPendingMember);
router.patch("/:projectId/rejectPendingMember/:userId", mustBeAuthenticated, ProjectController.rejectPendingMember);
router.get("/:projectId", ProjectController.getProjectById);

export default router;
