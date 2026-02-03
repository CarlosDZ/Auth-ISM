import { Controller, Get, Param } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
@Controller('auth')
export class EmailVerificationController {
    constructor(private readonly emailVerificationService: EmailVerificationService) {}

    @Get('verify-email/:token')
    async verifyEmail(@Param('token') token: string): Promise<{ success: true }> {
        return this.emailVerificationService.verifyToken(token);
    }
}

/*
This route is not going to be used manually, but instead used by the verification mail, thus it would not be included in the usage guide of the API, while being, however, documented on the router map.
*/
