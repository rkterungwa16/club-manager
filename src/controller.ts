import { NextFunction, Response } from "express";
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
            delete createdUserModified.salt;
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
                throw new ClubManagerError({
                    message: "Missing club id",
                    name: "Get a club details",
                    statusCode: 400
                });
            }
            const club = (await this.clubsService.findById(
                clubId
            )) as ClubsModelInterface;
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
                throw new ClubManagerError({
                    message: "something went wrong contact support",
                    name: "Get a club details",
                    statusCode: 500
                });
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
            // check if user is registered. if true send isRegistered as true else false
            // on frontend a false will pop reg form, a true will popup a login form
            // make api to login or register the person. then make api call to add the person as member
            const reciever = (await this.usersService.findOne({
                email: recieverEmail
            })) as UsersModelInterface;
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
            return res.status(200).send({
                message: "Invite has been sent",
                token,
                isRegistered: reciever ? true : false
            });
        } catch (err) {
            next(err);
        }
    };

    public addClubMember = async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            // check if
            if (!req.body.inviteToken) {
                throw new ClubManagerError({
                    message: "must contain invite token",
                    name: "Add club member",
                    statusCode: 400
                });
            }
            const {
                id,
                email
            } = req.currentUser as { id: string; email: string };
            await this.clubsService.checkOwner(id);
            const token = this.clubsService.verifyInviteToken(req.body.inviteToken);
            const isRegistered = await this.usersService.findUserByEmail(token.recieverEmail) as UsersModelInterface;
            const modifiedClub = await this.clubsService.addClubMember(token.clubId, isRegistered.id);
            const populated = await modifiedClub
                .populate("owner", "name email")
                .populate("members", "name email")
                .execPopulate()
            return res.status(200).send({
                message: "Invite has been sent",
                club: populated
            });
        } catch (err) {
            next(err);
        }
    }

    public removeClubMember = async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const {
                memberId,
                clubId
            } = req.params
            if (!memberId && !clubId) {
                throw new ClubManagerError({
                    message: "Member id is missing",
                    name: "Remove club member",
                    statusCode: 400
                });
            }
            await this.clubsService.checkOwner(req.params.memberId);
            const isRemoved = await this.clubsService.removeClubMember(clubId, memberId);
            const populated = await isRemoved
                .populate("owner", "name email")
                .populate("members", "name email")
                .execPopulate()
            return res.status(200).send({
                message: "Invite has been sent",
                club: populated
            });
        } catch(err) {
            next(err);
        }
    }
}
