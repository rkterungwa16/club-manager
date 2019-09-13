import { NextFunction, Request, Response } from "express";

import { Inject } from "typescript-ioc";
import * as validator from "validator";
import { ClubManagerError } from "../../services";

import { IValidator, UserRequestBodySchemaProperties } from "../types";

export class LoginRequestBodyValidator implements IValidator {
    @Inject
    public errorService!: ClubManagerError;
    public requiredProperties: UserRequestBodySchemaProperties;
    constructor() {
        this.requiredProperties = {
            password: {
                type: "string"
            },
            email: {
                type: "string"
            }
        };
    }
    public validate = (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        const reqBodyPropCheckError = this.errorService;
        reqBodyPropCheckError.name = "Request body validation";
        if (!Object.keys(req.body).length) {
            reqBodyPropCheckError.message = "Missing properties";
            reqBodyPropCheckError.statusCode = 400;
            throw reqBodyPropCheckError;
        }
        for (const prop of Object.keys(this.requiredProperties)) {
            if (!Object.keys(req.body).includes(prop)) {
                reqBodyPropCheckError.message = `${prop} is missing`;
                reqBodyPropCheckError.statusCode = 400;
                throw reqBodyPropCheckError;
            }
        }

        if (!validator.isEmail(req.body.email)) {
            reqBodyPropCheckError.message = "User has an invalid email";
            reqBodyPropCheckError.statusCode = 400;
            throw reqBodyPropCheckError;
        }

        if (req.body.password.length < 6) {
            reqBodyPropCheckError.message =
                "Password length must be greater than or equal to 6";
            reqBodyPropCheckError.statusCode = 400;
            throw reqBodyPropCheckError;
        }

        next();
    };
}
