import { RequestBodySchemaProperties } from "../types";

export class ClubInviteRequestBodyProps {
    public requiredProperties: RequestBodySchemaProperties;
    constructor() {
        this.requiredProperties = {
            recieverEmail: {
                type: "email"
            },
            clubId: {
                type: "text"
            }
        };
    }
}
