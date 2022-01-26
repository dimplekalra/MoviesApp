import express, { Request, Response } from "express";
import logger from "morgan";
import cors from "cors";
import log from "./logger/index";
import connect from "./db/connect";
import routes from "./routes/index.routes";
import { deserializeUser } from "./middleware";
import path from "path";
import * as secret from "./utils/secrets";

export const port = process.env.PORT || secret.port || 5000;
export const host = process.env.HOST || secret.host || "localhost";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(cors());

app.use(deserializeUser);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  // app.get("*", (req: Request, res: Response) => {
  //   return res.sendFile(
  //     path.resolve(__dirname, "client", "build", "index.html")
  //   );
  // });
}

app.listen(port, () => {
  log.info(`Server listing at http://${host}:${port}`);
  connect();

  routes(app);
});

export default app;
