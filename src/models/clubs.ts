import { DatasourceConnection } from "../datasource";
import { ClubsModelInterface } from "./model.types";

const mongooseConnection = DatasourceConnection.databaseConnection;

import { Schema } from "mongoose";

class ClubsSchema {
    static get schema() {
        return new Schema({
            name: {
                type: String
            },
            owner: {
                type: Schema.Types.ObjectId,
                ref: "Users",
                required: true
            },
            members : [{
                type: Schema.Types.ObjectId,
                ref: 'Users'
            }]
        });
    }
}

export const Clubs = mongooseConnection.model<ClubsModelInterface>(
    "Clubs",
    ClubsSchema.schema
);
