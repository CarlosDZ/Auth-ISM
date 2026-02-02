import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailVerificationController } from './email-verification.controller';
import { EmailVerificationService } from './email-verification.service';

@Module({
    controllers: [EmailVerificationController],
    providers: [EmailVerificationService, PrismaService],
    exports: [EmailVerificationService]
})
export class EmailVerificationModule {}
