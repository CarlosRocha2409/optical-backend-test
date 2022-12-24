import { Response, Request, NextFunction } from "express";
import { StaffService } from "../services/Staff.service";
import { OK } from "../types/error.type";

export default class StaffController {
  private service: StaffService;

  constructor() {
    this.service = new StaffService();
  }

  getById = (req: Request, res: Response, next: NextFunction) => {
    this.service
      .findById(req.params.userId)
      .then((staff) => {
        res.status(OK).json(staff);
      })
      .catch((e) => next(e));
  };

  create = (req: Request, res: Response, next: NextFunction) => {
    this.service
      .create(req.body)
      .then((id) => {
        res.status(OK).json(id);
      })
      .catch((e) => next(e));
  };

  update = (req: Request, res: Response, next: NextFunction) => {
    this.service
      .update({
        id: req.params.userId,
        ...req.body,
      })
      .then((id) => {
        res.status(OK).json(id);
      })
      .catch((e) => next(e));
  };

  login = (req: Request, res: Response, next: NextFunction) => {
    this.service
      .login(req.body)
      .then((jwt) => {
        res.status(OK).json(jwt);
      })
      .catch((e) => next(e));
  };
}
