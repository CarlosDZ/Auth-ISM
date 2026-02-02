import { Controller, Post, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { TenantLookupService } from 'src/utils/tenant-lookup.service';

@Controller('tenants/:slug/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly tenantLookupService: TenantLookupService
    ) {}

    @Post()
    async createUserInTenant(@Param('slug') slug: string, @Body() dto: CreateUserDto) {
        // 1 - Slug to id
        const tenant = await this.tenantLookupService.findBySlug(slug);

        // 2 - User registration
        const tenantId: string = tenant.id;
        const user = await this.usersService.registerTenantUser(tenantId, dto);

        return {
            tenant: {
                id: tenant.id,
                slug: tenant.slug
            },
            user
        };
    }
}
