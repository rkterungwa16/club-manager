import express from "express";
import { Inject } from "typescript-ioc";
import { ClubManagerController } from "./controller";
import {
    ClubInviteRequestBodyValidator,
    LoginRequestBodyValidator,
    RegisterationRequestBodyValidator
} from "./middlewares";

import { authenticate } from "./middlewares";

const router = express.Router();
export class ClubManagerRoutes {
    @Inject
    private clubManagerController!: ClubManagerController;
    @Inject
    private validateRegistrationInput!: RegisterationRequestBodyValidator;
    @Inject
    private validateLoginInput!: LoginRequestBodyValidator;
    @Inject
    private validateClubInviteInput!: ClubInviteRequestBodyValidator;

    get routes() {
        router.post(
            "/register",
            this.validateRegistrationInput.validate,
            this.clubManagerController.register
        );
        router.post(
            "/login",
            this.validateLoginInput.validate,
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
            this.validateClubInviteInput.validate,
            authenticate,
            this.clubManagerController.sendClubInvite
        );
        router.post(
            "/add-member",
            authenticate,
            this.clubManagerController.addClubMember
        )
        return router;
    }
}
