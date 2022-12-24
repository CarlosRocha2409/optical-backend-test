import apiLogger from "../logger/api.logger";
import * as mongoose from "mongoose";

class DBConfig {
  private static instance: DBConfig;
  db: typeof mongoose;
  private conectionString: string = process.env.DB_CONNECTION!;
  private username: string = process.env.DB_USER!;
  private password: string = process.env.DB_PASSWORD!;

  constructor() {
    this.db = mongoose;
  }
  async connect() {
    this.db.set("strictQuery", true);
    this.db
      .connect(this.conectionString, {
        user: this.username,
        pass: this.password,
      })
      .then(() => {
        apiLogger.info("Successfully connected to DB");
      })
      .catch((error) => console.log(error));
  }

  public static getInstance(): DBConfig {
    if (!DBConfig.instance) {
      DBConfig.instance = new DBConfig();
    }
    return DBConfig.instance;
  }
}

export default DBConfig.getInstance();
