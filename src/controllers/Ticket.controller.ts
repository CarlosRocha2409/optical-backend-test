import { Response, Request, NextFunction } from "express";
import { StaffService } from "../services/Staff.service";
import { TicketService } from "../services/Ticket.service";

import { OK } from "../types/error.type";

export default class TicketController {
  private service: TicketService;
  private staffService: StaffService;

  constructor() {
    this.service = new TicketService();
    this.staffService = new StaffService();
  }

  getAll = (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page as string;
    this.service
      .findAll({
        page: page ? +page : 1,
      })
      .then((tickets) => {
        res.status(OK).json(tickets);
      })
      .catch((e) => next(e));
  };

  getById = (req: Request, res: Response, next: NextFunction) => {
    this.service
      .findById(req.params.ticketId)
      .then((product) => {
        res.status(OK).json(product);
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

  delete = (req: Request, res: Response, next: NextFunction) => {
    this.service
      .delete(req.params.ticketId)
      .then((id) => {
        res.status(OK).json(id);
      })
      .catch((e) => next(e));
  };

  changeStatus = (req: Request, res: Response, next: NextFunction) => {
    this.service
      .changeStatus({
        id: req.params.ticketId,
        ...req.body,
      })
      .then((id) => {
        res.status(OK).json(id);
      })
      .catch((e) => next(e));
  };

  assignTicket = async (req: Request, res: Response, next: NextFunction) => {
    const staffMemberId = res.locals.staff.id;
    await this.staffService.findById(staffMemberId);

    this.service
      .assignTicket({
        id: req.params.ticketId,
        assignee: staffMemberId,
      })
      .then((id) => {
        res.status(OK).json(id);
      })
      .catch((e) => next(e));
  };

  postComment = async (req: Request, res: Response, next: NextFunction) => {
    const staffMemberId = res.locals.staff.id;
    await this.staffService.findById(staffMemberId);

    this.service
      .postComment({
        ticketId: req.params.ticketId,
        staff: staffMemberId,
        ...req.body,
      })
      .then((id) => {
        res.status(OK).json(id);
      })
      .catch((e) => next(e));
  };
}
