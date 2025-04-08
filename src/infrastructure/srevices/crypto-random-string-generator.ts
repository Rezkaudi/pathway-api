import crypto from "crypto";

import { RandomStringGenerator } from "../../domain/services/random-str-generator.service";

export class CryptoRandomStringGenerator implements RandomStringGenerator {
    generate(length: number): string {
        return crypto.randomBytes(length).toString("hex");
    }
}
