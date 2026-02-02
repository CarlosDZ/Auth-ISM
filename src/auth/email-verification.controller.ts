import { Controller, Post, Body, Param } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { VerifyEmailDto } from './dto/verification-token.dto';

@Controller('auth')
export class EmailVerificationController {
    constructor(private readonly emailVerificationService: EmailVerificationService) {}

    @Post('verify-email')
    async verifyEmail(
        @Param('slug') slug: string,
        @Body() dto: VerifyEmailDto
    ): Promise<{ success: true }> {
        return this.emailVerificationService.verifyToken(dto.token);
    }
}
