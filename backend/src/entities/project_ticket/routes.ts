import { Router } from "express";
import { ProjectController } from "../project/controllers";
import { mustBeAuthenticated } from "../../middlewares/mustBeAuthenticated";
import { ProjectTicketsController } from "./controller";
import { mustHavePermission } from "../../middlewares/mustHavePermission";
import { Permission } from "../project/schema";
import { validateBody } from "../../middlewares/validateBody";
import { ProjectTicketSchemas } from "./zod";

const router = Router({ mergeParams: true });

router.get("/", ProjectTicketsController.getProjectTickets);
router.post(
	"/",
	mustBeAuthenticated,
	mustHavePermission(Permission.TicketsCreate),
	validateBody(ProjectTicketSchemas.create),
	ProjectTicketsController.createTicket,
);
router.patch("/:ticketId/request", mustBeAuthenticated, mustHavePermission(Permission.TicketsRequest), ProjectTicketsController.requestTicket);
router.patch(
	"/:ticketId/assign",
	mustBeAuthenticated,
	mustHavePermission(Permission.TicketsAssign),
	validateBody(ProjectTicketSchemas.assign),
	ProjectTicketsController.assignTicket,
);
router.patch("/:ticketId/finish", mustBeAuthenticated, mustHavePermission(Permission.TicketsEdit), ProjectTicketsController.finishTicket);

export default router;
