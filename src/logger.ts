import { NextFunction, Response } from "express";
import { TransformableInfo } from "logform";
import { IRequest } from "types";
import { createLogger, format, Logger, transports } from "winston";

const { label, prettyPrint, combine, timestamp, colorize, printf, ms } = format;

class ApplicationLogger {
    /**
     * Create application logger
     * @param labelInfo Information describing a part of the application
     * @return Logger
     */
    public createAppLogger = (labelInfo: string): Logger => {
        return createLogger({
            format: combine(
                label({
                    label: labelInfo
                }),
                ms(),
                timestamp(),
                prettyPrint(),
                colorize(),
                printf((printInfo: TransformableInfo) => {
                    return `${printInfo.ms} ${printInfo.timestamp} [${printInfo.label}] ${printInfo.level}: ${printInfo.message}`;
                })
            ),
            transports: [new transports.Console()]
        });
    };

    public appLogInfoMiddleware = (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        const startTime = this.getHrTime();
        this.createAppLogger("Request Information").log({
            level: "info",
            message: `${req.ip}-${req.method}-${req.url}`
        });

        // log the finished requests
        res.once("finish", () => {
            const responseTotalTime = this.getHrTime() - startTime;

            this.createAppLogger("Response Information").log({
                level: "info",
                message: `${req.requestId} - ${responseTotalTime} - ${res.statusCode}`
            });
        });

        next();
    };
    /**
     * Get high resolution time
     * @return response time in milisecond and nanoseconds
     */
    private getHrTime = () => {
        const ts = process.hrtime();
        return ts[0] * 1000 + ts[1] / 1000000;
    };
}
const applicationLogger = new ApplicationLogger();
export const appLogger = applicationLogger.createAppLogger;
export const appLogInfoMiddleware = applicationLogger.appLogInfoMiddleware;
