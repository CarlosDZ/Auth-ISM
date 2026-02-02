import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { TenantAdminGuard } from 'src/auth/guards/tenant-admin.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TenantLookupService } from 'src/utils/tenant-lookup.service';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleLookupService } from 'src/utils/role-lookup.service';
import { ScopeLookupService } from 'src/utils/scope-lookup.service';

@Controller('tenants/:slug/roles')
export class RolesController {
    constructor(
        private readonly rolesService: RolesService,
        private readonly tenantLookupService: TenantLookupService,
        private readonly roleLookupService: RoleLookupService,
        private readonly scopeLookupService: ScopeLookupService
    ) {}

    @UseGuards(JwtAuthGuard, TenantAdminGuard)
    @Post()
    async createRole(@Param('slug') slug: string, @Body() dto: CreateRoleDto) {
        const tenant = await this.tenantLookupService.findBySlug(slug);
        return this.rolesService.createRole(tenant.id, dto);
    }

    @UseGuards(JwtAuthGuard, TenantAdminGuard)
    @Post(':roleName/scopes/:scopeName')
    async assignScopeToRole(
        @Param('slug') slug: string,
        @Param('roleName') roleName: string,
        @Param('scopeName') scopeName: string
    ) {
        const tenant = await this.tenantLookupService.findBySlug(slug);
        const tenantId: string = tenant.id;

        const role = await this.roleLookupService.findOnTenant(roleName, tenantId);
        const scope = await this.scopeLookupService.findOnTenant(scopeName, tenantId);

        const roleId: string = role.id;
        const scopeId: string = scope.id;

        return this.rolesService.assignScopeToRole(tenantId, roleId, scopeId);
    }
}
