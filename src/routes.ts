import express from "express";
import { Inject } from "typescript-ioc";
import { ClubManagerController } from "./controller";
import { Validator } from "./middlewares";

import { authenticate } from "./middlewares";

const router = express.Router();
export class ClubManagerRoutes {
    @Inject
    private clubManagerController!: ClubManagerController;
    @Inject
    private validator!: Validator;

    get routes() {
        router.post(
            "/register",
            this.validator.validate("register"),
            this.clubManagerController.register
        );
        router.post(
            "/login",
            this.validator.validate("login"),
            this.clubManagerController.login
        );
        router.post(
            "/create-club",
            authenticate,
            this.clubManagerController.createClub
        );
        router.get(
            "/club/:clubId",
            authenticate,
            this.clubManagerController.findOneClub
        );
        router.post(
            "/send-invite",
            this.validator.validate("clubInvite"),
            authenticate,
            this.clubManagerController.sendClubInvite
        );
        router.patch(
            "/add-member",
            authenticate,
            this.clubManagerController.addClubMember
        );
        router.delete(
            "/remove-member/:clubId/:memberId",
            authenticate,
            this.clubManagerController.removeClubMember
        );
        return router;
    }
}
