import { ErrorDetails } from "./";
export class ClubManagerError extends Error {
    public statusCode: number;
    public message: string;
    public name: string;
    constructor(errorDetails: ErrorDetails) {
        super();
        this.statusCode = errorDetails.statusCode || 500;
        this.message = errorDetails.message || "";
        this.name = errorDetails.name || "";
    }
}
