import { LeanDocument, FilterQuery, UpdateQuery } from "mongoose";
// import config from "config";
import { get } from "lodash";
import { IUserDocument } from "../model/user.model";
import Session, { ISessionDocument } from "../model/session.model";
import { sign, decode } from "../utils/jwt.utils";
import { findUser } from "./user.service";
import { accessTokenTtl } from "../utils/secrets";

export async function createSession(userId: string, userAgent: string) {
  const session = await Session.create({ user: userId, userAgent });

  return session.toJSON();
}

export function createAccessToken({
  user,
  session,
}: {
  user:
    | Omit<IUserDocument, "password">
    | LeanDocument<Omit<IUserDocument, "password">>;
  session:
    | Omit<ISessionDocument, "password">
    | LeanDocument<Omit<ISessionDocument, "password">>;
}) {
  const expiry =
    (process.env.accessTokenTtl as string) || accessTokenTtl || "1d";
  // || config.get("accessTokenTtl") || "1d";
  // Build and return the new access token
  const accessToken = sign(
    { ...user, session: session._id },
    { expiresIn: expiry }
  );

  return accessToken;
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = await decode(refreshToken);

  if (!decoded || !get(decoded, "_id")) return false;

  const session = await Session.findById(get(decoded, "_id"));

  if (!session || !session?.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  const accessToken = createAccessToken({ user, session });

  return accessToken;
}

export async function updateSession(
  query: FilterQuery<ISessionDocument>,
  update: UpdateQuery<ISessionDocument>
) {
  return Session.updateOne(query, update);
}

export async function removeUserSessions(
  query: FilterQuery<ISessionDocument>,
  update: UpdateQuery<ISessionDocument>
) {
  return Session.deleteMany(query, update);
}

export async function findSessions(query: FilterQuery<ISessionDocument>) {
  return Session.find(query).lean();
}

export async function findSingleSessions(query: FilterQuery<ISessionDocument>) {
  return Session.findOne(query).sort("desc").lean();
}
