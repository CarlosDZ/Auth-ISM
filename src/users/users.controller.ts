import { Controller, Post, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { TenantsService } from '../tenants/tenants.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('tenants/:slug/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly tenantsService: TenantsService
    ) {}

    @Post()
    async createUserInTenant(@Param('slug') slug: string, @Body() dto: CreateUserDto) {
        // 1 - Slug to id
        const tenant = await this.tenantsService.findBySlug(slug);

        // 2 - User registration
        const user = await this.usersService.registerTenantUser(tenant.id, dto);

        return {
            tenant: {
                id: tenant.id,
                slug: tenant.slug
            },
            user
        };
    }
}
