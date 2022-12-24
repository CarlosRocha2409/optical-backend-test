import { Router } from "express";
import TicketController from "../controllers/Ticket.controller";
import { authMiddleWare } from "../utils/auth.utils";

export class ProductRouter {
  router: Router;
  controller: TicketController;

  constructor() {
    this.router = Router();
    this.controller = new TicketController();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("/", authMiddleWare, this.controller.getAll);
    this.router.post("/", this.controller.create);
    this.router.get("/:ticketId", authMiddleWare, this.controller.getById);
    this.router.delete("/:ticketId", authMiddleWare, this.controller.delete);

    this.router.post(
      "/:ticketId/status",
      authMiddleWare,
      this.controller.changeStatus
    );

    this.router.post(
      "/:ticketId/assign",
      authMiddleWare,
      this.controller.assignTicket
    );

    this.router.post(
      "/:ticketId/comment",
      authMiddleWare,
      this.controller.postComment
    );
  }
}

export default new ProductRouter().router;
