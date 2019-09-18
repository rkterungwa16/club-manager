import { RequestBodySchemaProperties } from "../types";

export class LoginRequestBodyProps {
    public requiredProperties: RequestBodySchemaProperties;
    constructor() {
        this.requiredProperties = {
            password: {
                type: "password"
            },
            email: {
                type: "email"
            }
        };
    }
}
