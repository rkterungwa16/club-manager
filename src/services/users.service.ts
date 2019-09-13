import { sign } from "jsonwebtoken";
import { Model } from "mongoose";
import { Inject } from "typescript-ioc";
import { Users, UsersModelInterface } from "../models";
import { ClubManagerError } from "./error.service";
import { BcryptHasher } from "./password.hash.service";
import { PasswordHashService } from "./types";

export class UsersService {
    @Inject
    public passwordHashService!: BcryptHasher;
    @Inject
    public usersModel!: Model<UsersModelInterface>;
    @Inject
    public clubManagerError!: ClubManagerError;
    private jwtSecret: string;

    constructor() {
        this.jwtSecret = process.env.APP_SECRET as string;
    }

    public async create(
        credentials: UsersModelInterface
    ): Promise<UsersModelInterface> {
        return await this.usersModel.create(credentials);
    }

    public async findOne(email: string): Promise<UsersModelInterface | null> {
        const user = await this.usersModel.findOne({
            email
        });
        if (!user) {
            const userNotFoundError = this.clubManagerError;
            userNotFoundError.message = "user does not exist";
            userNotFoundError.statusCode = 400;
            throw userNotFoundError;
        }

        return user;
    }

    public async confirmUserDoesNotExist(email: string): Promise<boolean> {
        const foundUser = await this.usersModel.findOne({
            email
        });
        if (foundUser) {
            const userAlreadyExistsError = this.clubManagerError;
            userAlreadyExistsError.name = "User registration";
            userAlreadyExistsError.message = "User Already Exists";
            throw userAlreadyExistsError;
        }

        return true;
    }

    public async findAndGenerateToken(credentials: {
        email: string;
        password: string;
    }): Promise<string> {
        const foundUser = await this.usersModel.findOne({
            email: credentials.email
        });

        const userDoesNotExistError = this.clubManagerError;
        userDoesNotExistError.name = "User Login";
        if (!foundUser) {
            userDoesNotExistError.message = "User does not exist";
            userDoesNotExistError.statusCode = 400;
            throw userDoesNotExistError;
        }

        const passwordMatched = await this.passwordHashService.comparePassword(
            credentials.password,
            foundUser.password
        );

        if (!passwordMatched) {
            throw new Error("");
        }

        const token = await sign(foundUser, this.jwtSecret, {
            expiresIn: "24h"
        });

        return token;
    }
}
