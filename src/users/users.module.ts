import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SecurityModule } from './security/security.module';
import { PrismaService } from 'prisma/prisma.service';
import { EmailVerificationModule } from 'src/auth/email-verification.module';

@Module({
    imports: [SecurityModule, EmailVerificationModule],
    providers: [UsersService, PrismaService],
    exports: [UsersService]
})
export class UsersModule {}
