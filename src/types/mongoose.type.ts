import { Document } from "mongoose";

export type TDocumentResponse<T> = Document<unknown, any, T> &
  T & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
  };
