import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ScopesService } from './scopes.service';
import { CreateScopeDto } from './dto/create-scope.dto';
import { TenantAdminGuard } from 'src/auth/guards/tenant-admin.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TenantLookupService } from 'src/utils/tenant-lookup.service';

@Controller('tenants/:slug/scopes')
export class ScopesController {
    constructor(
        private readonly scopesService: ScopesService,
        private readonly tenantLookupService: TenantLookupService
    ) {}

    @UseGuards(JwtAuthGuard, TenantAdminGuard)
    @Post()
    async createScope(@Param('slug') slug: string, @Body() dto: CreateScopeDto) {
        const tenant = await this.tenantLookupService.findBySlug(slug);
        const id: string = tenant.id;
        return this.scopesService.createScope(id, dto);
    }
}
