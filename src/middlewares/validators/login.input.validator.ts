import { NextFunction, Request, Response } from "express";

import { RequestBodySchemaProperties } from "../types";
import { Validator } from "./validator";

export class LoginRequestBodyValidator extends Validator {
    public requiredProperties: RequestBodySchemaProperties;
    constructor() {
        super();
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
        this.checkEmptyRequestBody(req.body);
        this.checkMissingRequestBodyProperties(req.body);

        this.validateEmail(req.body.email);
        this.validatePassword(req.body.password);

        next();
    };
}
