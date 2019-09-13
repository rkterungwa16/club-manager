import cors from "cors";
import express, { NextFunction, Response } from "express";
import { Inject } from "typescript-ioc";
import uuid from "uuid";
import { ClubManagerRoutes } from "./routes";
import { IRequest } from './types';

import { appLogInfoMiddleware } from './logger';

export class App {
    public static init() {
        const app = express();

        app.use(cors());
        app.use(express.json());

        app.use((req: IRequest, res: Response, next: NextFunction) => {
            req.requestId = uuid();
            next();
          });

          app.use(appLogInfoMiddleware);

        app.use("/api/v1", this.clubManagerRoutes.routes);

        return app;
    }
    @Inject
    private static clubManagerRoutes: ClubManagerRoutes;
}
