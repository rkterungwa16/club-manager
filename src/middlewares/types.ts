import { NextFunction, Request, Response } from "express";

export interface RequestBodySchemaProperties {
    [key: string]: {
        [key: string]: string;
    };
}

export interface IValidator {
    requiredProperties: RequestBodySchemaProperties;
    validate(req: Request, res: Response, next: NextFunction): void;
}
