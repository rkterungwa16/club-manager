import * as dotenv from "dotenv";
import { sign, verify } from "jsonwebtoken";
import { Clubs, ClubsModelInterface } from "../models";
import { DefaultModelService } from "./default.model.service";
import { ClubManagerError } from "./error.service";

dotenv.config();
export class ClubsService extends DefaultModelService<ClubsModelInterface> {
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
                throw new ClubManagerError({
                    message: "club does not exist",
                    statusCode: 400,
                    name: "Find Club"
                });
            }
            return club;
        } catch (err) {
            throw new ClubManagerError({
                message: "please contact support",
                name: "Find Club"
            });
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
            throw new ClubManagerError({
                message: "Invalid token",
                statusCode: 400,
                name: "Token Verification"
            });
        }
    }

    public async addClubMember(clubId: string, memberId: string) {
        try {
            const addedMember = await this.findClubById(clubId);
            if (addedMember.members.includes(memberId)) {
                throw new ClubManagerError({
                    message: "Already a member of this club",
                    statusCode: 422,
                    name: "Add Club Member"
                });
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
            throw new ClubManagerError({
                message: "Current user is not owner of club",
                statusCode: 403,
                name: "Club Owner"
            });
        }
        return true;
    }

    public async removeClubMember(clubId: string, memberId: string) {
        const club = await this.findClubById(clubId);
        if (!club.members.includes(memberId)) {
            throw new ClubManagerError({
                message: "Not a member of this club",
                statusCode: 422,
                name: "Remove Club Member"
            });
        }
        const memberIndex = club.members.indexOf(memberId);
        club.members.splice(memberIndex, 1);
        await club.save();
        return club;
    }
}
