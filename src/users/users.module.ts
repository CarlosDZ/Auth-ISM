import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SecurityModule } from './security/security.module';
import { PrismaService } from 'prisma/prisma.service';
import { EmailVerificationModule } from 'src/auth/mail-verification/email-verification.module';
import { UsersController } from './users.controller';
import { UtilsModule } from 'src/utils/utils.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
    imports: [SecurityModule, EmailVerificationModule, UtilsModule, RolesModule],
    controllers: [UsersController],
    providers: [UsersService, PrismaService],
    exports: [UsersService]
})
export class UsersModule {}
