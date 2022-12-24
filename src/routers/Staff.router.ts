import { Router } from "express";
import StaffController from "../controllers/Staff.controller";
import { authMiddleWare } from "../utils/auth.utils";

export class ProductRouter {
  router: Router;
  controller: StaffController;

  constructor() {
    this.router = Router();
    this.controller = new StaffController();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post("/login", this.controller.login);
    this.router.get("/:userId", authMiddleWare, this.controller.getById);
    this.router.put("/:userId", authMiddleWare, this.controller.update);
  }
}

export default new ProductRouter().router;
