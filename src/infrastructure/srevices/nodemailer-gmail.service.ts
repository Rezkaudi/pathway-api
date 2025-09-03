import nodemailer from "nodemailer";
import { Attachment, MailService } from "../../domain/services/mail.service";

export class NodemailerGmailService implements MailService {
    private transporter;

    constructor(
        private readonly user: string,
        private readonly pass: string
    ) {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: this.user,
                pass: this.pass,
            },
        });
    }

    verify = async (): Promise<void> => {
        try {
            await this.transporter.verify();
        } catch (err: any) {
            throw new Error("SMTP verification failed");
        }
    };

    send = async (
        to: string,
        subject: string,
        template: string,
        attachments?: Attachment[]
    ): Promise<void> => {
        try {
            const mailOptions = {
                from: this.user,
                to,
                subject,
                html: template,
                attachments,
            };

            const result = await this.transporter.sendMail(mailOptions);

            if (!result.accepted || result.accepted.length === 0) {
                throw new Error("Email was not accepted by any recipient");
            }
        } catch (err: any) {
            throw new Error("Failed to send email");
        }
    };
}
