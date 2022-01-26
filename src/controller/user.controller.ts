import { NextFunction, Request, Response } from "express";
import { extend, get, omit } from "lodash";
import {
  createUser,
  findAndUpdateUser,
  findUser,
  removeUser,
} from "../service/user.service";
import log from "../logger";
import { removeUserSessions, updateSession } from "../service/session.service";

export async function getUserHandler(req: Request, res: Response) {
  try {
    const userId = get(req, "user._id");

    const user = await findUser({ _id: userId });

    if (!user) throw new Error("Failed to Get User");

    return res.status(200).json({
      message: "Success",
      data: omit(user, "password"),
    });
  } catch (e: any) {
    log.error(e);
    return res.status(409).json({
      error: e.message,
      data: null,
    });
  }
}

export async function createUserHandler(req: Request, res: Response) {
  try {
    const user = await createUser(req.body);
    return res.status(200).json({
      message: "Success",
      data: omit(user.toJSON(), "password"),
    });
  } catch (e: any) {
    log.error(e);
    return res.status(409).json({
      data: null,
      error: e.message,
    });
  }
}

export async function updateUserHandler(req: Request, res: Response) {
  try {
    const userId = get(req, "user._id");
    const update = req.body;

    const updatedUser = await findAndUpdateUser({ _id: userId }, update, {
      new: true,
    });

    if (!updatedUser) throw new Error("Failed to Update User");

    return res.status(200).json({
      message: "Success",
      data: omit(updatedUser.toJSON(), "password"),
    });
  } catch (e: any) {
    log.error(e);
    return res.status(409).json({ data: null, error: e.message });
  }
}

export async function removeUserHandler(req: Request, res: Response) {
  try {
    const userId = get(req, "user._id");
    const sessionId = get(req, "user.session");
    await removeUserSessions({ _id: sessionId }, { valid: false });
    await removeUser({ _id: userId });

    return res.status(200).json({
      message: "Successfully Removed User",
    });
  } catch (e: any) {
    log.error(e);
    return res.status(409).json({ data: null, error: e.message });
  }
}
