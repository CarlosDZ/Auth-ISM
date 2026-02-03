import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { RolesModule } from 'src/roles/roles.module';
import { TenantsModule } from 'src/tenants/tenants.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { GuardsModule } from './guards/guards.module';
@Module({
  imports: [
    UsersModule,
    RolesModule,
    TenantsModule,
    GuardsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '20m' }
    })
  ],
  providers: [AuthService],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
