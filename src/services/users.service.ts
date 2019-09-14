import * as dotenv from "dotenv";
import { sign } from "jsonwebtoken";
import { Inject } from "typescript-ioc";
import { Users, UsersModelInterface } from "../models";
import { DefaultModelService } from "./default.model.service";
import { ClubManagerError } from "./error.service";
import { BcryptHasher } from "./password.hash.service";

dotenv.config();
export class UsersService extends DefaultModelService<UsersModelInterface> {
    @Inject
    public passwordHashService!: BcryptHasher;
    @Inject
    public clubManagerError!: ClubManagerError;
    private jwtSecret: string;

    constructor() {
        super(Users);
        this.jwtSecret = process.env.APP_SECRET as string;
    }

    public async register(
        credentials: UsersModelInterface
    ): Promise<UsersModelInterface> {
        return await this.create(credentials);
    }

    public async findUserByEmail(
        email: string
    ): Promise<UsersModelInterface | null> {
        const user = await this.findOne({ email });
        if (!user) {
            const userNotFoundError = this.clubManagerError;
            userNotFoundError.message = "user does not exist";
            userNotFoundError.statusCode = 400;
            throw userNotFoundError;
        }

        return user;
    }

    public confirmUserDoesNotExist = async (
        email: string
    ): Promise<boolean> => {
        try {
            const foundUser = await this.findOne({
                email
            });
            if (foundUser) {
                const userAlreadyExistsError = this.clubManagerError;
                userAlreadyExistsError.name = "User registration";
                userAlreadyExistsError.message = "User Already Exists";
                userAlreadyExistsError.statusCode = 400;
                throw userAlreadyExistsError;
            }
            return true;
        } catch (err) {
            throw err;
        }
    };

    public async findAndGenerateToken(credentials: {
        email: string;
        password: string;
    }): Promise<string> {
        const foundUser = await this.findOne({
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
            const passwordDoesNotMatch = this.clubManagerError;
            passwordDoesNotMatch.name = "User login";
            passwordDoesNotMatch.message = "wrong password";
            passwordDoesNotMatch.statusCode = 400;
            throw passwordDoesNotMatch;
        }

        const token = await sign(
            {
                email: foundUser.email,
                id: foundUser.id
            },
            this.jwtSecret,
            { expiresIn: "24h" }
        );

        return token;
    }
}
