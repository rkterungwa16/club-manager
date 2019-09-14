import * as dotenv from "dotenv";
import { sign, verify } from "jsonwebtoken";
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
        } catch (err) {
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

    public verifyInviteToken(token: string): { recieverEmail: string; clubId: string } {

        try {
            const isVerified = verify(token, this.jwtSecret) as { recieverEmail: string; clubId: string };
            return isVerified;
        } catch (err) {
            const tokenVerification = this.errorService;
            tokenVerification.message = "Invalid token";
            tokenVerification.name = "Token Verification";
            tokenVerification.statusCode = 400;
            throw tokenVerification;
        }
    }

    public async addClubMember(clubId: string, memberId: string) {
        try {
            const addedMember = await this.findClubById(clubId);
            if (addedMember.members.includes(memberId)) {
                const alreadyAMember = this.errorService;
                alreadyAMember.message = "Already a member of this club";
                alreadyAMember.statusCode = 422;
                throw alreadyAMember;
            }
            addedMember.members.push(memberId);
            addedMember.save();

            // /clubMembers.push(memberId).;
            return addedMember;
        } catch(err) {
            throw(err);
        }
    }
    public async checkOwner (id: string): Promise<boolean> {
        const isOwner = this.findOne({
            owner: id
        });
        if (!isOwner) {
            const notClubOwner = this.errorService;
            notClubOwner.message = "Current user is not owner of club";
            notClubOwner.statusCode = 403;
            throw notClubOwner;
        }
        return true;
    }

    public async removeClubMember(clubId: string, memberId: string) {
        const club = await this.findClubById(clubId);
        if (!club.members.includes(memberId)) {
            const notAMember = this.errorService;
            notAMember.message = "Not a member of this club";
            notAMember.statusCode = 422;
            throw notAMember;
        }
        const memberIndex = club.members.indexOf(memberId);
        club.members.splice(memberIndex, 1);
        await club.save();
        return club;
    }
}
