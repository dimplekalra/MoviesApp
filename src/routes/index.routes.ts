import { Express, Request, Response } from "express";
import userRoutes from "./user.routes";
import sessionRoutes from "./session.routes";
import movieRoutes from "./movie.routes";

export default function (app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  userRoutes(app);
  sessionRoutes(app);
  movieRoutes(app);
}
