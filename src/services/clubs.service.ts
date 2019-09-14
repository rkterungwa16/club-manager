import * as dotenv from "dotenv";
import { Inject } from "typescript-ioc";
import { Clubs, ClubsModelInterface } from "../models";
import { DefaultModelService } from "./default.model.service";
import { ClubManagerError } from "./error.service";

dotenv.config();
export class ClubsService extends DefaultModelService<ClubsModelInterface> {
    @Inject
    public clubManagerError!: ClubManagerError;

    constructor() {
        super(Clubs);
    }

    public async createClub(
        credentials: ClubsModelInterface
    ): Promise<ClubsModelInterface> {
        return await this.create(credentials);
    }
}
