import mailjet from "node-mailjet";
import { Inject } from "typescript-ioc";
import { ClubManagerError } from "./error.service";

export class EmailService {
    private apiKey: string;
    private apiSecret: string;
    private version: string;
    @Inject
    private errorService!: ClubManagerError;
    constructor() {
        this.apiKey = process.env.MAIL_JET_API_KEY as string;
        this.apiSecret = process.env.MAIL_JET_API_SECRET as string;
        this.version = process.env.MAIL_JET_API_VERSION as string;
    }

    public sendEmail(emailInfo: {
        senderEmail: string;
        recieverEmail: string;
        recieverName: string;
        messageSubject: string;
        messageHtmlContent: string;
    }) {
        const { apiSecret, apiKey, version } = this;

        const {
            senderEmail,
            recieverEmail,
            recieverName,
            messageHtmlContent,
            messageSubject
        } = emailInfo;
        return new Promise((resolve, reject) => {
            const mailRequest = mailjet
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
            mailRequest
                .then(result => {
                    resolve(result.body)
                })
                .catch(err => {
                    const emailError = this.errorService;
                    emailError.message = err.ErrorMessage;
                    emailError.statusCode = err.statusCode;
                    reject(emailError);
                });
        });
    }
}
