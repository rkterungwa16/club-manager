import { Request } from "express";
export interface IRequest extends Request {
    requestId?: string;
    models?: {
        [keys: string]: any;
    };
}
