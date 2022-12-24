import { model } from "mongoose";
import { TicketSchema } from "../model/Ticket.model";

export const Ticket = model("Ticket", TicketSchema);
