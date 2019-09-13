import { genSalt, hash } from "bcryptjs";
import { compare } from "bcryptjs";

import { PasswordHashService } from "./types";

export class BcryptHasher implements PasswordHashService<string> {
    private readonly rounds: number;
    constructor() {
        this.rounds = 10;
    }

    public async hashPassword(password: string, salt: string): Promise<string> {
        return await hash(password, salt);
    }

    public async saltPassword(): Promise<string> {
        return await genSalt(this.rounds);
    }

    public async comparePassword(
        providedPass: string,
        storedPass: string
    ): Promise<boolean> {
        const passwordIsMatched = await compare(providedPass, storedPass);
        return passwordIsMatched;
    }
}
