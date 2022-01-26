import { Express, Request, Response } from "express";
import {
  createUserSessionHandler,
  invalidateUserSessionHandler,
  getUserSessionsHandler,
  getSingleUserSessionHandler,
} from "../controller/session.controller";
import { createUserSessionSchema } from "../schema/user.schema";
import { validateRequest, requiresUser } from "../middleware";

export default function (app: Express) {
  // Login
  app.post(
    "/api/sessions",
    validateRequest(createUserSessionSchema),
    createUserSessionHandler
  );

  // Get the user's sessions
  app.get("/api/sessions", requiresUser, getUserSessionsHandler);

  // Get the user's single session
  app.get("/api/sessions/single", requiresUser, getSingleUserSessionHandler);

  // Logout
  app.delete("/api/sessions", requiresUser, invalidateUserSessionHandler);
}
