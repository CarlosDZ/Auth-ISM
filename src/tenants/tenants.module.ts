import { Module } from '@nestjs/common';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RolesService } from 'src/roles/roles.service';
import { UsersModule } from 'src/users/users.module';
import { EmailVerificationModule } from 'src/auth/mail-verification/email-verification.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
    imports: [UsersModule, EmailVerificationModule, UtilsModule],
    controllers: [TenantsController],
    providers: [TenantsService, PrismaService, RolesService],
    exports: [TenantsService]
})
export class TenantsModule {}
