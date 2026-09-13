import { Router } from "express";
import { ProjectController } from "./controllers";
import { mustBeAuthenticated } from "../../middlewares/mustBeAuthenticated";
import { ProjectActivityController } from "../project_activity/controller";

const router = Router();

router.post("/", mustBeAuthenticated, ProjectController.createProject);
router.get("/", ProjectController.getProjects);
router.patch("/:projectId/addResource", mustBeAuthenticated, ProjectController.addResourceToProject);
router.patch("/:projectId/joinAsPendingMember",mustBeAuthenticated, ProjectController.joinAsPendingMember);
router.patch("/:projectId/joinAsMember",mustBeAuthenticated, ProjectController.joinAsMember);
router.patch("/:projectId/acceptPendingMember/:userId", mustBeAuthenticated, ProjectController.acceptPendingMember);
router.patch("/:projectId/rejectPendingMember/:userId", mustBeAuthenticated, ProjectController.rejectPendingMember);
router.patch("/:projectId/editMember/:userId", mustBeAuthenticated, ProjectController.editMember);
router.patch("/:projectId/removeMember/:userId", mustBeAuthenticated, ProjectController.removeMember);
router.get("/:projectId", ProjectController.getProjectById);
router.post("/:projectId/activity", mustBeAuthenticated, ProjectActivityController.addActivity);
router.get("/:projectId/activity", ProjectActivityController.getActivity);

export default router;
