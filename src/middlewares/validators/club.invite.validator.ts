import { NextFunction, Request, Response } from "express";

import { RequestBodySchemaProperties } from "../types";
import { Validator } from "./validator";

export class ClubInviteRequestBodyValidator extends Validator {
    public requiredProperties: RequestBodySchemaProperties;
    constructor() {
        super();
        this.requiredProperties = {
            recieverEmail: {
                type: "string"
            },
            clubId: {
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

        next();
    };
}
