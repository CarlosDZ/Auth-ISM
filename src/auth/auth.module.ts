import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { RolesModule } from 'src/roles/roles.module';
import { TenantsModule } from 'src/tenants/tenants.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { GuardsModule } from './guards/guards.module';
import { PrismaService } from 'prisma/prisma.service';
import { SecurityModule } from 'src/users/security/security.module';
import { TenantLookupService } from 'src/utils/tenant-lookup.service';
import { UserLookupService } from 'src/utils/user-lookup.service';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
@Module({
    imports: [
        UsersModule,
        RolesModule,
        TenantsModule,
        SecurityModule,
        GuardsModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '20m' }
            })
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, PrismaService, TenantLookupService, UserLookupService],
    exports: [AuthService, JwtModule]
})
export class AuthModule {}
