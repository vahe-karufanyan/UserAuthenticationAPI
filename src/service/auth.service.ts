import { DocumentType } from "@typegoose/typegoose";
import { omit } from "lodash";
import SessionModel from "../model/session.model";
import { privateFields, User } from "../model/user.model";
import { signJwt } from "../utils/jwt";

export async function createSession({ userId }: { userId: string }) {
  return SessionModel.create({ user: userId });
}

export async function findSessionById(id: string) {
  return SessionModel.findById(id);
}

export function signAccessToken(user: DocumentType<User>) {
  const payload = omit(user.toJSON(), privateFields);

  const accessToken = signJwt(payload, "accessTokenPrivateKey", {
    expiresIn: "15m",
  });

  return accessToken;
}