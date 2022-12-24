import { model } from "mongoose";
import { StaffSchema } from "../model/Staff.model";

export const Staff = model("Staff", StaffSchema);
