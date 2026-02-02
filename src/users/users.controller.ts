import { Controller, Post, Param, Body, UseGuards, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { TenantLookupService } from 'src/utils/tenant-lookup.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TenantAdminGuard } from 'src/auth/guards/tenant-admin.guard';
import { RoleLookupService } from 'src/utils/role-lookup.service';
import { UserLookupService } from 'src/utils/user-lookup.service';

@Controller('tenants/:slug/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly tenantLookupService: TenantLookupService,
        private readonly roleLookupService: RoleLookupService,
        private readonly userLookupService: UserLookupService
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

    @UseGuards(JwtAuthGuard, TenantAdminGuard)
    @Post(':userMail/roles/:roleName')
    async assignRoleToUser(
        @Param('slug') slug: string,
        @Param('roleName') roleName: string,
        @Param('userMail') userMail: string
    ) {
        const tenant = await this.tenantLookupService.findBySlug(slug);
        const tenantId: string = tenant.id;

        const role = await this.roleLookupService.findOnTenant(roleName, tenantId);
        const user = await this.userLookupService.findOnTenant(userMail, tenantId);

        const roleId: string = role.id;
        const userId: string = user.id;

        return this.usersService.assignRoleToUser(tenantId, userId, roleId);
    }

    @UseGuards(JwtAuthGuard, TenantAdminGuard)
    @Delete(':userMail/roles/:roleName')
    async deleteRoleFromUser(
        @Param('slug') slug: string,
        @Param('roleName') roleName: string,
        @Param('userMail') userMail: string
    ) {
        const tenant = await this.tenantLookupService.findBySlug(slug);
        const tenantId: string = tenant.id;

        const role = await this.roleLookupService.findOnTenant(roleName, tenantId);
        const user = await this.userLookupService.findOnTenant(userMail, tenantId);

        const roleId: string = role.id;
        const userId: string = user.id;

        return this.usersService.deleteRoleFromUser(tenantId, userId, roleId);
    }
}
