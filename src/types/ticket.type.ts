import { IStaff } from "./staff.type";

export interface IComment {
  id: string;
  staff: IStaff;
  description: string;
  active: boolean;
  createdAt: Date;
}

export interface ICommentInput {
  ticketId: string;
  description: string;
  staff: string;
}

export const CommentInputFields = ["ticketId", "description", "staff"];

export type TTicketStatus = "in-progress" | "for-review" | "fixed";

export interface ITicket {
  id: string;
  assignee?: IStaff;
  description: string;
  userEmail: string;
  status: TTicketStatus;
  active: boolean;
  product: number;
  createdAt: Date;
  comments: IComment[];
}

export interface ITicketInput {
  userEmail: string;
  description: string;
  product: number;
}

export interface ITicketUpdate
  extends Partial<Omit<ITicket, "assignee" | "status">> {
  id: string;
  assignee?: string;
  status?: number;
}

export interface ITicketChangeStatus {
  id: string;
  status: number;
}

export interface ITicketChangeAssignee {
  id: string;
  assignee: string;
}

export const TicketInputFields = ["userEmail", "description", "product"];
export const TicketUpdateFields = ["id"];
export const productTypes = [
  "Website",
  "Mobile App",
  "Suscriptions",
  "General",
  "Other",
];
export const ticketStatusNames = ["in-progress", "for-review", "fixed"];
