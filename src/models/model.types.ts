import { Document } from "mongoose";

export interface UsersModelInterface extends Document {
    name: string;
    email: string;
    salt: string;
    password: string;
}
