import { Express, Request, Response } from "express";
import {
  getUserHandler,
  createUserHandler,
  removeUserHandler,
  updateUserHandler,
} from "../controller/user.controller";

import { validateRequest, requiresUser } from "../middleware";
import {
  createUserSchema,
  removeUserSchema,
  updateUserSchema,
} from "../schema/user.schema";

export default function (app: Express) {
  //Get User
  app.get("/api/users", requiresUser, getUserHandler);

  // Register user
  app.post("/api/users", validateRequest(createUserSchema), createUserHandler);

  // update User
  app.put(
    "/api/users",
    [requiresUser, validateRequest(updateUserSchema)],
    updateUserHandler
  );

  // Delete user
  app.delete(
    "/api/users/:userId",
    [requiresUser, validateRequest(removeUserSchema)],
    removeUserHandler
  );
}
