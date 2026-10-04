import { Router } from "express";
import { ProjectActivityController } from "./controller";
import { mustBeAuthenticated } from "../../middlewares/mustBeAuthenticated";
import { mustHavePermission } from "../../middlewares/mustHavePermission";
import { Permission } from "../project/schema";
import { validateBody } from "../../middlewares/validateBody";
import { ProjectActivitySchemas } from "./zod";

const router = Router({ mergeParams: true });

router.get("/", ProjectActivityController.getActivity);
router.use(mustHavePermission(Permission.ActivityAdd));
router.post(
  "/",
  mustBeAuthenticated,
  validateBody(ProjectActivitySchemas.addActivity),
  ProjectActivityController.addActivity,
);
router.post(
  "/:activityId/messages",
  mustBeAuthenticated,
  validateBody(ProjectActivitySchemas.addDiscussionMessage),
  ProjectActivityController.addDiscussionMessage,
);
router.post(
  "/:activityId/votes",
  mustBeAuthenticated,
  validateBody(ProjectActivitySchemas.addVote),
  ProjectActivityController.addVote,
);

export default router;
