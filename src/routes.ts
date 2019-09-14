import express from "express";
import { Inject } from "typescript-ioc";
import { ClubManagerController } from "./controller";
import {
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

    get routes() {
        router
            .route("/register")
            .post(
                this.validateRegistrationInput.validate,
                this.clubManagerController.register
            );
        router
            .route("/login")
            .post(
                this.validateLoginInput.validate,
                this.clubManagerController.login
            );
        router.route("/create-club").post(authenticate, this.clubManagerController.createClub);
        router.get("/club/:clubId", authenticate, this.clubManagerController.findOneClub);
        return router;
    } // /order/cancel/:orderId
}
