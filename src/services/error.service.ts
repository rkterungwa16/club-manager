export class ClubManagerError extends Error {
    public statusCode: number;
    constructor() {
        super();
        this.statusCode = 500;
    }
}
