import { NextFunction, Request, Response } from "express";
import { Inject } from "typescript-ioc";
import { UsersModelInterface } from "./models";
import { BcryptHasher, ClubManagerError, UsersService } from "./services";
import { IRequest } from "./types";

export class ClubManagerController {
    @Inject
    public usersService!: UsersService;
    @Inject
    public errorService!: ClubManagerError;
    @Inject
    public passwordHasher!: BcryptHasher;

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

    public createClub = async (req: Request, res: Response) => {
        try {
            // const { booksCollectionName, searchTerm } = req.body;
            // const searchResult = await this.invertedIndexService.search(searchTerm, booksCollectionName);
            // return res.status(200).send({
            //     message: "Successful search result",
            //     searchResult,
            // });
        } catch (err) {
            return res.status(400).send({
                message: "bad request",
                err
            });
        }
    };
}
