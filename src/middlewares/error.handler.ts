import { NextFunction, Response } from "express";
import { ClubManagerError } from "../services";
import { IRequest } from "../types";

export const apiErrorHandler = (
    err: ClubManagerError,
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    const response = {
        code: err.statusCode,
        message: err.message
    };

    res.status(err.statusCode);
    res.send(response);
};
