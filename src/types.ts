import { Request } from "express";
export interface IRequest extends Request {
    requestId?: string;
    currentUser?: {
        email: string;
        id: string;
    };
}
