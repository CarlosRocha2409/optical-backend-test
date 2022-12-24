import mongoose from "mongoose";
import { TDocumentResponse } from "./mongoose.type";

export interface IStaff {
  _id: mongoose.Types.ObjectId;
  name: string;
  lastname: string;
  passwordHash: string;
  email: string;
  active: boolean;
}

export interface IStaffInput {
  name: string;
  lastname: string;
  email: string;
  password: string;
}
export interface IstaffLogin {
  email: string;
  password: string;
}

export interface IStaffUpdate extends Partial<IStaffInput> {
  id: string;
}

export const StaffInputKeys = ["name", "lastname", "email", "password"];
export const StaffUpdateKeys = ["id"];
export type IStaffDocument = TDocumentResponse<IStaff>;
