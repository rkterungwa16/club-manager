import { Document } from "mongoose";

export interface UsersModelInterface extends Document {
    name: string;
    email: string;
    salt: string;
    password: string;
    memberOf?: string[];
}

export interface ClubsModelInterface extends Document {
    name?: string;
    owner: string;
    members?: string[];
}
