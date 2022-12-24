import {
  IComment,
  productTypes,
  ticketStatusNames,
} from "../types/ticket.type";
import { StaffDTO } from "./staff.dto";

export class CommentDTO {
  staffMember: StaffDTO;
  description: string;
  active: boolean;
  createdAt: Date;

  constructor(comment: any) {
    this.staffMember = new StaffDTO(comment.staff);
    this.description = comment.description;
    this.active = comment.active;
    this.createdAt = comment.created_at;
  }
}

export class TicketDTO {
  id: string;
  description: string;
  userEmail: string;
  statusIndex: number;
  status: string;
  assignee: StaffDTO | null;
  comments: CommentDTO[];
  product: string;
  createdAt: Date;

  constructor(ticket: any) {
    this.description = ticket.description;
    this.userEmail = ticket.userEmail;
    this.status = ticketStatusNames[ticket.status - 1];
    this.statusIndex = ticket.status;
    this.assignee = ticket.assignee ? new StaffDTO(ticket.assignee) : null;
    this.createdAt = ticket.created_at;
    this.comments = ticket.comments.map((c: any) => new CommentDTO(c));
    this.product = productTypes[ticket.product - 1];
    this.id = ticket.id;
  }
}
