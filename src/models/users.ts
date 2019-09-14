import { DatasourceConnection } from "../datasource";
import { UsersModelInterface } from "./model.types";

const mongooseConnection = DatasourceConnection.databaseConnection;

import { Schema } from "mongoose";

class UsersSchema {
    static get schema() {
        return new Schema({
            name: {
                type: String
            },
            email: {
                type: String,
                required: true
            },
            salt: {
                type: String,
                require: true
            },
            password: {
                type: String,
                required: true
            },
            memberOf : [{
                type: Schema.Types.ObjectId,
                ref: 'Clubs'
            }]
        });
    }
}

export const Users = mongooseConnection.model<UsersModelInterface>(
    "Users",
    UsersSchema.schema
);
