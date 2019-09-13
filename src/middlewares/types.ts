import { NextFunction, Request, Response } from "express";

export interface UserRequestBodySchemaProperties {
    [key: string]: {
        [key: string]: string;
    };
}

export interface IValidator {
    requiredProperties: UserRequestBodySchemaProperties;
    validate(req: Request, res: Response, next: NextFunction): void;
}
