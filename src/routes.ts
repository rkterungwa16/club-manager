import express from "express";
import { Inject } from "typescript-ioc";
import { ClubManagerController } from "./controller";

const router = express.Router();

export class ClubManagerRoutes {
    @Inject
    private invertedIndexController!: ClubManagerController;

    get routes() {
        router.route("/login").post(this.invertedIndexController.login);
        router.route("/invite").post(this.invertedIndexController.createClub);
        return router;
    }
}
