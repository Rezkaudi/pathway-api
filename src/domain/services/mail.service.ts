export interface Attachment {
    filename: string;
    content: Buffer<ArrayBuffer>;
    encoding: string;
    cid: string;
}

export interface MailService {
    send(to: string, subject: string, template: string, attachments?: Attachment[]): Promise<void>;
    verify(): Promise<void>
}
