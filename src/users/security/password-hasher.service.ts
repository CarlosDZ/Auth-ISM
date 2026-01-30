import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordHasher {
    private readonly pepper: string;

    constructor() {
        const pepper = process.env.AUTH_PEPPER;
        if (!pepper) {
            throw new Error('AUTH_PEPPER is not set. Cannot hash passwords without pepper. We can just ask to wait till we can resolve this incidence.');
        }
        this.pepper = pepper;
    }

    async hash(password: string): Promise<string> {
        const input = password + this.pepper;
        return await argon2.hash(input, { type: argon2.argon2id });
    }

    async verify(hash: string, password: string): Promise<boolean> {
        const input = password + this.pepper;
        return await argon2.verify(hash, input);
    }
}
