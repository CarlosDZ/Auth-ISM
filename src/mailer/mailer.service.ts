import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';
import { AppConfig } from '../config/app-config';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class MailerService {
    private readonly resend = new Resend(process.env.RESEND_API_KEY);

    async sendVerificationEmail(email: string, token: string) {
        const verifyUrl = `${AppConfig.baseUrl}/verify-email?token=${token}`;

        const html = this.renderTemplate('verify-email.html', {
            verifyUrl
        });

        try {
            await this.resend.emails.send({
                from: AppConfig.emailDomain,
                to: email,
                subject: 'Verify your email',
                html
            });
        } catch (err) {
            console.error('Error sending email:', err);
            throw new InternalServerErrorException('Failed to send verification email');
        }
    }

    private renderTemplate(templateName: string, variables: Record<string, string>) {
        const templatePath = join(__dirname, 'templates', templateName);
        let html = readFileSync(templatePath, 'utf8');

        for (const [key, value] of Object.entries(variables)) {
            html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }

        return html;
    }
}
