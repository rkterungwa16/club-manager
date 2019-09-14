import * as dotenv from "dotenv";
import { sign } from "jsonwebtoken";
import { Inject } from "typescript-ioc";
import { Clubs, ClubsModelInterface } from "../models";
import { DefaultModelService } from "./default.model.service";
import { ClubManagerError } from "./error.service";

dotenv.config();
export class ClubsService extends DefaultModelService<ClubsModelInterface> {
    @Inject
    public errorService!: ClubManagerError;
    private jwtSecret: string;

    constructor() {
        super(Clubs);
        this.jwtSecret = process.env.INVITE_SECRET as string;
    }

    public async createClub(
        credentials: ClubsModelInterface
    ): Promise<ClubsModelInterface> {

        try {
            return await this.create(credentials);
        } catch (err) {
            throw err;
        }
    }

    public async findClubById(id: string) {
        try {
            const club = await this.findById(id);
            if (!club) {
                const clubNotFoundError = this.errorService;
                clubNotFoundError.message = "club does not exist";
                clubNotFoundError.statusCode = 400;
                clubNotFoundError.name = "Find Club";
                throw clubNotFoundError;
            }
            return club;
        } catch(err) {
            const somethingWentWrong = this.errorService;
            somethingWentWrong.message = "please contact support";
            somethingWentWrong.name = "find club";
            throw somethingWentWrong;
        }
    }

    public async generateToken(clubId: string, recieverEmail: string) {
        return await sign(
            {
                clubId,
                recieverEmail
            },
            this.jwtSecret,
            { expiresIn: 60 * 15 }
        );
    }
}
