import { ITEMS_PER_PAGE } from "../config/general.config";
import { TicketDTO } from "../dtos/ticket.dto";
import { ApiError } from "../error-handling/ApiError";
import { Ticket } from "../repository/Ticket.repository";
import { BAD_REQUEST, INTERNAL_SERVER } from "../types/error.type";
import logger from "../logger/api.logger";
import { throwServerError, validateFields } from "../utils/validation.util";
import {
  CommentInputFields,
  ICommentInput,
  ITicketChangeAssignee,
  ITicketChangeStatus,
  ITicketInput,
  ITicketUpdate,
  TicketInputFields,
  TicketUpdateFields,
} from "../types/ticket.type";
import { PaginationDTO } from "../dtos/pagination.dto";

export class TicketService {
  repo: typeof Ticket;

  constructor() {
    this.repo = Ticket;
  }

  async findAll({ page = 1 }: { page?: number }) {
    const errorGettingUsers = (e: any) => {
      throwServerError(e, "getting users");
    };

    const count = await this.repo.count();

    return this.repo
      .find({}, null, {
        limit: ITEMS_PER_PAGE,
        skip: (page - 1) * ITEMS_PER_PAGE,
      })
      .populate("assignee")
      .populate({
        path: "comments",
        populate: "staff",
      })
      .then((tickets) => {
        return new PaginationDTO(
          page,
          count,
          ITEMS_PER_PAGE,
          tickets.map((ticket) => new TicketDTO(ticket))
        );
      })
      .catch(errorGettingUsers);
  }

  async findById(id: string) {
    return this.repo
      .findById(id)
      .populate("assignee")
      .populate({
        path: "comments",
        populate: "staff",
      })
      .then((ticket) => {
        if (!ticket)
          throw new ApiError(`Ticket with id ${id} not found`, BAD_REQUEST);
        return new TicketDTO(ticket);
      })
      .catch((e) => {
        if (e.statusCode) throw e;
        throw new ApiError(`Ticket with id ${id} not found`, BAD_REQUEST);
      });
  }

  private validateCreate(ticket: ITicketInput) {
    validateFields({
      fields: TicketInputFields,
      item: ticket,
      action: "creating a",
      itemName: "ticket",
    });
  }

  async create(ticket: ITicketInput) {
    this.validateCreate(ticket);

    const throwCreateServerError = (e: any) => {
      throwServerError(e, "creating a ticket");
    };

    return this.repo
      .create(ticket)
      .then((t) => {
        return {
          id: t._id.toString(),
        };
      })
      .catch((e) => {
        throw throwCreateServerError(e);
      });
  }

  private async validateUpdate(ticket: ITicketUpdate) {
    validateFields({
      fields: TicketUpdateFields,
      item: ticket,
      action: "updating a",
      itemName: "ticket",
    });
    await this.findById(ticket.id);
  }

  private async update(ticket: ITicketUpdate): Promise<{ id: string }> {
    await this.validateUpdate(ticket);

    const throwUpdateServerError = (e: any) => {
      throwServerError(e, "updating a ticket");
    };

    return this.repo
      .updateOne(
        { id: ticket.id },
        {
          ...ticket,
        }
      )
      .then(() => {
        return {
          id: ticket.id,
        };
      })
      .catch((e) => {
        throw throwUpdateServerError(e);
      });
  }

  async changeStatus(ticket: ITicketChangeStatus) {
    if (!ticket.status)
      throw new ApiError(
        `Status field is necessary for updating status`,
        BAD_REQUEST
      );
    return this.update(ticket);
  }

  async assignTicket(ticket: ITicketChangeAssignee) {
    if (!ticket.assignee)
      throw new ApiError(
        `Asignee field is necessary for assigning staff user`,
        BAD_REQUEST
      );

    return this.update({
      ...ticket,
    });
  }

  private async validatePostComment(comment: ICommentInput) {
    validateFields({
      fields: CommentInputFields,
      item: comment,
      action: "creating a",
      itemName: "comment",
    });
  }

  async postComment(comment: ICommentInput) {
    this.validatePostComment(comment);

    const ticket = await this.repo.findById(comment.ticketId).then((ticket) => {
      if (!ticket)
        throw new ApiError(
          `Ticket with id ${comment.ticketId} not found`,
          BAD_REQUEST
        );
      return ticket;
    });

    ticket.comments.push(comment);

    return ticket
      .save()
      .then((t) => {
        return { id: t._id.toString() };
      })
      .catch((e) => {
        throw throwServerError(e, "posting comment");
      });
  }

  async delete(id: string) {
    this.validateUpdate({ id });
    return this.update({ id, active: false });
  }
}
