import { Router } from "express";
import { ProjectController } from "./controllers";
import { mustBeAuthenticated } from "../../middlewares/mustBeAuthenticated";
import ProjectTicketRouter from "../project_ticket/routes";
import ProjectActivityRouter from "../project_activity/routes";
import { mustHavePermission } from "../../middlewares/mustHavePermission";
import { Permission } from "./schema";
import { validateBody } from "../../middlewares/validateBody";
import { ProjectSchemas } from "./zod";
import { CompletedProjectSchemas } from "../completed_project/zod";

const router = Router();

router.post(
  "/",
  mustBeAuthenticated,
  validateBody(ProjectSchemas.createProjectSchema),
  ProjectController.createProject,
);
router.get("/", ProjectController.getProjects);
router.get("/byUserId/:userId", ProjectController.getProjectsByUserId);
router.patch(
  "/:projectId/addResource",
  mustBeAuthenticated,
  mustHavePermission(Permission.ResourcesAdd),
  validateBody(ProjectSchemas.addResourceSchema),
  ProjectController.addResourceToProject,
);
router.patch(
  "/:projectId/settings",
  mustBeAuthenticated,
  mustHavePermission(Permission.DetailsEdit),
  validateBody(ProjectSchemas.updateProjectSettingsSchema),
  ProjectController.updateProjectSettings,
);
router.post(
  "/:projectId/complete",
  mustBeAuthenticated,
  mustHavePermission(Permission.DetailsEdit),
  validateBody(CompletedProjectSchemas.create),
  ProjectController.completeProject,
);
router.patch(
  "/:projectId/joinAsPendingMember",
  mustBeAuthenticated,
  ProjectController.joinAsPendingMember,
);
router.patch(
  "/:projectId/joinAsMember",
  mustBeAuthenticated,
  ProjectController.joinAsMember,
);
router.patch(
  "/:projectId/acceptPendingMember/:userId",
  mustBeAuthenticated,
  mustHavePermission(Permission.MembersAccept),
  ProjectController.acceptPendingMember,
);
router.patch(
  "/:projectId/rejectPendingMember/:userId",
  mustBeAuthenticated,
  mustHavePermission(Permission.MembersAccept),
  ProjectController.rejectPendingMember,
);
router.patch(
  "/:projectId/editMember/:userId",
  mustBeAuthenticated,
  mustHavePermission(Permission.MembersEditRole),
  validateBody(ProjectSchemas.editMemberSchema),
  ProjectController.editMember,
);
router.patch(
  "/:projectId/removeMember/:userId",
  mustBeAuthenticated,
  mustHavePermission(Permission.MembersRemove),
  ProjectController.removeMember,
);
router.get("/:projectId", ProjectController.getProjectById);

router.use("/:projectId/tickets", ProjectTicketRouter);
router.use("/:projectId/activity", ProjectActivityRouter);

export default router;
