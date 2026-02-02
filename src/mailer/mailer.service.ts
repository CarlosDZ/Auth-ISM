import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';
import { AppConfig } from '../config/app-config';


@Injectable()
export class MailerService {
    private readonly resend = new Resend(process.env.RESEND_API_KEY);

    async sendVerificationEmail(email: string, token: string) {
        const verifyUrl = `${AppConfig.baseUrl}/verify-email?token=${token}`;
        const html = this.renderTemplate(verifyUrl);

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

    private renderTemplate(verifyUrl: string): string {
        return ` 
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px">
                <h1>Verify your email</h1>
                <p>Click the link below to verify your email:</p>
                <p>
                <a href="${verifyUrl}" style="
                    background: #4f46e5;
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 6px;
                    display: inline-block;
                "
            >Verify Email</a> </p>

            <p>If the button doesn't work, copy and paste this URL:</p>
            <p>${verifyUrl}</p>

            <p>This link expires in 30 minutes.</p>
            </body>
        </html> `;
    }
}
