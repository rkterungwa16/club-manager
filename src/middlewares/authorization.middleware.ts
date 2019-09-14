import * as dotenv from "dotenv";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { ClubManagerError } from "../services"
import { IRequest } from "../types";

dotenv.config();
const verifyAsync = promisify(jwt.verify);

export const authenticate = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    let token = req.query.access_token || req.headers.authorization;

    if (!token) {
        const noAccessTokenFound = new ClubManagerError();
        noAccessTokenFound.message = "No access token found!";
        noAccessTokenFound.name = "Authentication";
        noAccessTokenFound.statusCode = 400;
        throw noAccessTokenFound;
    }

    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }

    try {
        const secret = process.env.APP_SECRET as string;
        const user = await verifyAsync(token, secret) as { email: string, id: string };
        req.currentUser = user;
        next();
    } catch (err) {
        const invalidAccessToken = new ClubManagerError();
        invalidAccessToken.message = "Not Authorized";
        invalidAccessToken.statusCode = 401;
        invalidAccessToken.name = "Authentication"

        throw invalidAccessToken;
    }
}
