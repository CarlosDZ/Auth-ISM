import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { RolesModule } from 'src/roles/roles.module';
import { TenantsModule } from 'src/tenants/tenants.module';
import { TenantAdminGuard } from './guards/tenant-admin.guard';
@Module({
    imports: [UsersModule, RolesModule, TenantsModule],
    providers: [TenantAdminGuard],
    exports: [TenantAdminGuard]
})
export class AuthModule {}
