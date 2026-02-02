import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { TenantAdminGuard } from 'src/auth/guards/tenant-admin.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TenantLookupService } from 'src/utils/tenant-lookup.service';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('tenants/:slug/roles')
export class RolesController {
    constructor(
        private readonly rolesService: RolesService,
        private readonly tenantLookupService: TenantLookupService
    ) {}

    @UseGuards(JwtAuthGuard, TenantAdminGuard)
    @Post()
    async createScope(@Param('slug') slug: string, @Body() dto: CreateRoleDto) {
        const tenant = await this.tenantLookupService.findBySlug(slug);
        const id: string = tenant.id;
        return this.rolesService.createRole(id, dto);
    }
}
