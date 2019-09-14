import { NextFunction, Response } from "express";
import { Types } from "mongoose";
import { Inject } from "typescript-ioc";
import { ClubsModelInterface, UsersModelInterface } from "./models";
import {
    BcryptHasher,
    ClubManagerError,
    ClubsService,
    EmailService,
    UsersService
} from "./services";
import { IRequest } from "./types";

export class ClubManagerController {
    @Inject
    public usersService!: UsersService;
    @Inject
    public clubsService!: ClubsService;
    @Inject
    public errorService!: ClubManagerError;
    @Inject
    public passwordHasher!: BcryptHasher;
    @Inject
    private emailService!: EmailService;

    public register = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            await this.usersService.confirmUserDoesNotExist(req.body.email);
            const salt = await this.passwordHasher.saltPassword();
            const hashedPassword = await this.passwordHasher.hashPassword(
                req.body.password,
                salt
            );
            const userInfo = {
                salt,
                password: hashedPassword,
                email: req.body.email as string,
                name: req.body.name as string
            } as UsersModelInterface;
            const createdUser = await this.usersService.register(userInfo);
            const createdUserModified = createdUser.toObject();
            delete createdUserModified.password;
            return res.status(201).send({
                message: "user successfully created",
                data: createdUserModified
            });
        } catch (err) {
            next(err);
        }
    };
    public login = async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const token = await this.usersService.findAndGenerateToken({
                email,
                password
            });
            return res.status(201).send({
                message: "user successfully logged in",
                data: token
            });
        } catch (err) {
            next(err);
        }
    };

    public createClub = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.currentUser as { id: string };
            const { name } = req.body;
            const club = await this.clubsService.createClub({
                owner: id,
                name: name ? name : ""
            } as ClubsModelInterface);
            const populated = await club
                .populate("owner", "name email")
                .execPopulate();
            return res.status(201).send({
                message: "Successfully created club",
                club: populated
            });
        } catch (err) {
            next(err);
        }
    };

    public findOneClub = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { clubId } = req.params;
            if (!clubId) {
                const missingParam = this.errorService;
                missingParam.name = "Get a club details";
                missingParam.message = "Missing club id";
                missingParam.statusCode = 400;
                throw missingParam;
            }
            const club = (await this.clubsService.findById(
                clubId
            )) as ClubsModelInterface;
            if (!club) {
                const clubDoesNotExist = this.errorService;
                clubDoesNotExist.name = "Get a club details";
                clubDoesNotExist.statusCode = 400;
                clubDoesNotExist.message = "Club does not exist";
                throw clubDoesNotExist;
            }
            const populated = await club
                .populate("owner", "email name")
                .populate("members", "name email")
                .execPopulate();
            return res.status(201).send({
                message: "Club find Successful",
                club: populated
            });
        } catch (err) {
            if (!err.statusCode) {
                const somethingWentWrong = this.errorService;
                somethingWentWrong.message =
                    "something went wrong contact support";
                somethingWentWrong.name = "Get a club details";
                somethingWentWrong.statusCode = 500;
                throw somethingWentWrong;
            }
            next(err);
        }
    };

    public sendClubInvite = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { recieverEmail, clubId } = req.body;
            const currentUser = req.currentUser as {
                email: string;
                id: string;
            };
            // const reciever = (await this.usersService.findUserByEmail(
            //     recieverEmail
            // )) as UsersModelInterface;
            const club = await this.clubsService.findClubById(
                clubId
            ) as ClubsModelInterface;

            const token = await this.clubsService.generateToken(
                club.id,
                recieverEmail
            );

            const messageHtmlContent = `
          <h3>Hello ${recieverEmail}!</h3>
          <h4>You have been invited as a member of club ${club.name}</h4>
          Click on this link to confirm your membership
          <a href='http://localhost:3000/club-invite/${token}'>Confirm</a>
          <h4>Regards,</h4>
          <h3>The Club Manager team</h3>
          `;

            const messageSubject = `${club.name ? club.name : "Club"} invite`;
            await this.emailService.sendEmail({
                senderEmail: currentUser.email,
                recieverEmail,
                recieverName: "",
                messageHtmlContent,
                messageSubject
            });
            return res.status(201).send({
                message: "Invite has been sent",
                token
            });
        } catch (err) {
            next(err);
        }
    };
}
