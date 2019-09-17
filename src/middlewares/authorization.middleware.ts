import * as dotenv from "dotenv";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { ClubManagerError } from "../services";
import { IRequest } from "../types";

dotenv.config();

export const authenticate = async (
    req: IRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {

    try {
        let token = req.query.access_token || req.headers.authorization;
        if (!token) {
            throw new ClubManagerError({
                message: "No access token found!",
                statusCode: 400,
                name: "Authentication"
            });
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length);
        }
        const secret = process.env.APP_SECRET as string;
        const user = await jwt.verify(token, secret) as {
            email: string;
            id: string;
        };
        req.currentUser = user;
        next();
    } catch (err) {
        next(new ClubManagerError({
            message: err.message ? err.message : "Not Authorized!",
            statusCode: 401,
            name: "Authentication"
        }))
    }
};
