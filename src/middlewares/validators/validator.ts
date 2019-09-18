import { NextFunction, Request, Response } from "express";
import { Inject } from "typescript-ioc";
import * as validator from "validator";
import { ClubManagerError } from "../../services";
import {
    ClubInviteRequestBodyProps,
    LoginRequestBodyProps,
    RegisterationRequestBodyProps
} from "./";

import { IValidator, RequestBodySchemaProperties } from "../types";

export class Validator implements IValidator {
    public requiredProperties: RequestBodySchemaProperties;
    @Inject
    private login!: LoginRequestBodyProps;
    @Inject
    private register!: RegisterationRequestBodyProps;
    @Inject
    private clubInvite!: ClubInviteRequestBodyProps;
    constructor() {
        this.requiredProperties = {
            password: {
                type: "string"
            }
        };
    }

    public checkEmptyRequestBody(reqBody: { [x: string]: any }) {
        if (!Object.keys(reqBody).length) {
            throw new ClubManagerError({
                message: "Missing properties",
                statusCode: 400,
                name: "Request body validation"
            });
        }
        return true;
    }

    public validateRequestBodyProperties(
        reqBody: { [x: string]: any },
        reqProps: RequestBodySchemaProperties
    ) {
        for (const prop of Object.keys(reqProps)) {
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

            if (reqProps[prop].type === "password") {
                this.validatePassword(reqBody[prop]);
            }
            if (reqProps[prop].type === "email") {
                this.validateEmail(reqBody[prop]);
            }
        }
        return true;
    }

    public validateEmail(email: string) {
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

    public validate = (validationType: string) => {
        return (req: Request, res: Response, next: NextFunction): void => {
            const self = this as { [x: string]: any };
            if (!self[validationType]) {
                throw new ClubManagerError({
                    message: "Validation type does not exist",
                    statusCode: 500,
                    name: "Validation"
                });
            }
            const reqProps = self[validationType]
                .requiredProperties as RequestBodySchemaProperties;
            this.checkEmptyRequestBody(req.body);
            this.validateRequestBodyProperties(req.body, reqProps);
            next();
        };
    };
}
