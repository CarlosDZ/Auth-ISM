import { Controller, Post, Body } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { VerifyEmailDto } from './dto/verification-token.dto';

@Controller('auth')
export class EmailVerificationController {
    constructor(private readonly emailVerificationService: EmailVerificationService) {}

    @Post('verify-email')
    async verifyEmail(@Body() dto: VerifyEmailDto): Promise<{ success: true }> {
        return this.emailVerificationService.verifyToken(dto.token);
    }
}

/*
This route is not going to be used manually, but instead used by the verification mail, thus it would not be included in the usage guide of the API, while being, however, documented on the router map.
*/
