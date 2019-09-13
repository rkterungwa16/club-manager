import * as dotenv from "dotenv";
import mongoose, { Connection } from "mongoose";

import { appLogger } from "./logger";

dotenv.config();
const databaseConnectionStartup = appLogger("Database connection startup");

const config = {
    databaseUri: process.env.DATABASE_URI
};

export class DatasourceConnection {
    public static databaseInstance: any;
    public static databaseConnection: Connection;

    public static connect(): Connection {
        if (DatasourceConnection.databaseInstance) {
            return DatasourceConnection.databaseInstance;
        }

        DatasourceConnection.databaseConnection = mongoose.connection;
        DatasourceConnection.databaseConnection.once("open", () => {
            databaseConnectionStartup.log({
                level: "info",
                message: "database successfully connected"
            });
        });

        DatasourceConnection.databaseInstance = mongoose.connect(
            config.databaseUri || "mongodb://localhost:27017/club-manager",
            {
                useNewUrlParser: true
            }
        );

        return DatasourceConnection.databaseInstance;
    }
}

DatasourceConnection.connect();
