import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { RolesModule } from 'src/roles/roles.module';
import { JwtModule } from '@nestjs/jwt';
import { UtilsModule } from 'src/utils/utils.module';
import { TenantAdminGuard } from './tenant-admin.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
@Module({
  imports: [UtilsModule, RolesModule],
  providers: [TenantAdminGuard, JwtAuthGuard],
  exports: [GuardsModule, JwtModule]
})
export class GuardsModule {}
