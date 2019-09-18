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
            throw new ClubManagerError({
                message: "user does not exist",
                name: "Find User",
                statusCode: 400
            });
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
                throw new ClubManagerError({
                    message: "User Already Exists",
                    name: "User registration",
                    statusCode: 400
                });
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

        if (!foundUser) {
            throw new ClubManagerError({
                message: "User does not exist",
                name: "User Login",
                statusCode: 400
            });
        }

        const passwordMatched = await this.passwordHashService.comparePassword(
            credentials.password,
            foundUser.password
        );

        if (!passwordMatched) {
            throw new ClubManagerError({
                message: "wrong password",
                name: "User login",
                statusCode: 400
            });
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
