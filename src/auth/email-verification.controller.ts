import { Controller, Post, Body, Param } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { CreateVerificationTokenDto, VerifyEmailDto } from './dto/verification-token.dto';
import { TenantsService } from 'src/tenants/tenants.service';

@Controller('auth')
export class EmailVerificationController {
    constructor(
        private readonly emailVerificationService: EmailVerificationService,
        private readonly tenantsService: TenantsService
    ) {}

    @Post(':slug/resend-verification')
    async resend(@Param('slug') slug: string, @Body() dto: CreateVerificationTokenDto) {
        const tenant = await this.tenantsService.findBySlug(slug);

        await this.emailVerificationService.sendVerification(tenant.id, dto.email);

        return {
            message: 'If the email exists, a new verification link was sent.'
        };
    }

    @Post('verify-email')
    async verifyEmail(
        @Param('slug') slug: string,
        @Body() dto: VerifyEmailDto
    ): Promise<{ success: true }> {
        return this.emailVerificationService.verifyToken(dto.token);
    }
}
