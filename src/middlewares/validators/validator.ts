import { NextFunction, Request, Response } from "express";

import { ClubManagerError } from "../../services";

import { IValidator, RequestBodySchemaProperties } from "../types";

export class Validator implements IValidator {
    public requiredProperties: RequestBodySchemaProperties;
    constructor() {
        this.requiredProperties = {};
    }

    public checkEmptyRequestBody(reqBody: { [x: string ]: any }) {
        if (!Object.keys(reqBody).length) {
            throw new ClubManagerError({
                message: "Missing properties",
                statusCode: 400,
                name: "Request body validation"
            });
        }
        return true;
    }

    public checkMissingRequestBodyProperties(reqBody: { [x: string ]: any }) {
        for (const prop of Object.keys(this.requiredProperties)) {
            if (!Object.keys(reqBody).includes(prop)) {
                throw new ClubManagerError({
                    message: `${prop} is missing`,
                    statusCode: 400,
                    name: "Request body validation"
                });
            }

            if (!reqBody[prop]) {
                throw new ClubManagerError({
                    message: `${prop} should not be empty`,
                    statusCode: 400,
                    name: "Request body validation"
                });
            }
        }
        return true;
    }

    public validateEmail (email: string) {
        if (!validator.isEmail(email)) {
            throw new ClubManagerError({
                message: "User has an invalid email",
                statusCode: 400,
                name: "Request body validation"
            });
        }
        return true;
    }

    public validatePassword(password: string) {
        if (password.length < 6) {
            throw new ClubManagerError({
                message: "Password length must be greater than or equal to 6",
                statusCode: 400,
                name: "Request body validation"
            });
        }
        return true;
    }
    public validate = (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {

        this.checkEmptyRequestBody(req.body);
        this.checkMissingRequestBodyProperties(req.body);
        next();
    };
}
