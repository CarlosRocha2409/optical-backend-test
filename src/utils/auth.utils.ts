import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../config/general.config";
import jwt from "jsonwebtoken";
import { FORBIDDEN, UNAUTHORIZED } from "../types/error.type";
import { ApiError } from "../error-handling/ApiError";
import { Response, Request, NextFunction } from "express";

export async function generatePasswordHash(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS).then(function (hash) {
    return hash;
  });
}

export async function comparePasswords(password: string, hash: string) {
  return bcrypt.compare(password, hash).then(function (result) {
    return result;
  });
}

interface IjwtContent {
  id: string;
  email: string;
}

export async function generateJWT({ id, email }: IjwtContent) {
  return jwt.sign({ id, email }, process.env.JWT_SECRET as string);
}

export async function verifyJWT(token: string) {
  return jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err: any, staff: any) => {
      if (err) throw new ApiError(`Invalid Token`, FORBIDDEN);
      return staff;
    }
  );
}

export async function authMiddleWare(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(UNAUTHORIZED);

  const user = await verifyJWT(token);
  res.locals.staff = user;
  next();
}
