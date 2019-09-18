import { NextFunction, Request, Response } from "express";

import { RequestBodySchemaProperties } from "../types";
import { Validator } from "./validator";

export class RegisterationRequestBodyProps {
    public requiredProperties: RequestBodySchemaProperties;
    constructor() {
        this.requiredProperties = {
            password: {
                type: "password"
            },
            email: {
                type: "email"
            },
            name: {
                type: "text"
            }
        };
    }
}
