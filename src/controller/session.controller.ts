// import config from "config";
import { get } from "lodash";
import { Request, Response } from "express";
import { validatePassword } from "../service/user.service";
import {
  createSession,
  createAccessToken,
  updateSession,
  findSessions,
  findSingleSessions,
} from "../service/session.service";
import { sign } from "../utils/jwt.utils";
import { IUserDocument } from "../model/user.model";
import log from "../logger";
import { accessTokenTtl, refreshTokenTtl } from "../utils/secrets";

export async function createUserSessionHandler(req: Request, res: Response) {
  try {
    let user = await validatePassword(req.body);

    if (!user) {
      return res
        .status(401)
        .json({ data: null, error: "Invalid username or password" });
    }

    // Create a session
    const session = await createSession(user._id, req.get("user-agent") || "");

    // create access token
    const accessToken = await createAccessToken({
      user,
      session,
    });

    // ||
    // config.get("refreshTokenTtl") ||
    // "1y";

    // create refresh token
    const refreshToken = await sign(
      { ...session },
      {
        expiresIn: refreshTokenTtl,
      }
    );

    // || config.get("accessTokenTtl") || "1d";

    // send refresh, access token & expiry back
    return res.status(200).json({
      message: "Success",
      data: {
        accessToken,
        refreshToken,
        expiry: accessTokenTtl,
      },
    });
  } catch (error: any) {
    // console.log(error);
    log.error(error);
    return res.status(403).json({ data: null, error: error.message });
  }
  // validate the email and password
}

export async function invalidateUserSessionHandler(
  req: Request,
  res: Response
) {
  try {
    const sessionId = get(req, "user.session");

    await updateSession({ _id: sessionId }, { valid: false });

    return res.status(200).json({ message: "success", data: null });
  } catch (error: any) {
    log.error(error);
    return res.status(403).json({ data: null, error: error.message });
  }
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  try {
    const userId = get(req, "user._id");

    const sessions = await findSessions({ user: userId, valid: true });

    return res.json({ message: "Success", data: sessions });
  } catch (error: any) {
    log.error(error);
    return res.status(403).json({ data: null, error: error.message });
  }
}
export async function getSingleUserSessionHandler(req: Request, res: Response) {
  try {
    const userId = get(req, "user._id");

    const sessions = await findSingleSessions({ user: userId, valid: true });

    return res.json({ message: "Success", data: sessions });
  } catch (error: any) {
    log.error(error);
    return res.status(403).json({ data: null, error: error.message });
  }
}
