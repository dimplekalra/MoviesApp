import mongoose from "mongoose";
// import config from "config";
import log from "../logger";
import {
  database,
  local_dbUri,
  production_dbUri,
  read_writes,
} from "../utils/secrets";

function connect() {
  const dbUri =
    process.env.NODE_ENV === "development"
      ? local_dbUri
      : // ||  (config.get("local_dbUri") as string)
        production_dbUri;
  // ||  (config.get("production_dbUri") as string);

  // const database = database;
  // // || (config.get("database") as string);

  // const read_writes = process.env.read_writes as string;
  // // || (config.get("read_writes") as string);

  const uri = `${dbUri}${database}?${read_writes}`;

  return mongoose
    .connect(uri, {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    })
    .then(() => {
      log.info("Database connected");
    })
    .catch((error: any) => {
      log.error("db error", error);
      // process.exit(1);
    });
}
export default connect;
