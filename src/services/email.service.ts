import mailjet from "node-mailjet";
import { ClubManagerError } from "./error.service";

export class EmailService {
    private apiKey: string;
    private apiSecret: string;
    private version: string;
    constructor() {
        this.apiKey = process.env.MAIL_JET_API_KEY as string;
        this.apiSecret = process.env.MAIL_JET_API_SECRET as string;
        this.version = process.env.MAIL_JET_API_VERSION as string;
    }

    public async sendEmail(emailInfo: {
        senderEmail: string;
        recieverEmail: string;
        recieverName: string;
        messageSubject: string;
        messageHtmlContent: string;
    }) {
        try {
            const { apiSecret, apiKey, version } = this;
            const {
                senderEmail,
                recieverEmail,
                recieverName,
                messageHtmlContent,
                messageSubject
            } = emailInfo;
            const mailRequest = await mailjet
                .connect(apiKey, apiSecret)
                .post("send", { version })
                .request({
                    Messages: [
                        {
                            From: {
                                Email: senderEmail,
                                Name: "Club Manager Inc"
                            },
                            To: [
                                {
                                    Email: recieverEmail,
                                    Name: recieverName
                                }
                            ],
                            Subject: messageSubject,
                            HTMLPart: messageHtmlContent
                        }
                    ]
                });
            return mailRequest;
        } catch (err) {
            throw new ClubManagerError({
                message: err.ErrorMessage,
                statusCode: err.statusCode,
                name: "Send Email"
            })
        }
    }
}
