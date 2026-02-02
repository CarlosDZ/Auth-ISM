import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { RolesService } from "src/roles/roles.service";
import { TenantsService } from "src/tenants/tenants.service";
import { AuthUser } from "../types/auth-user.type";
import { UsersService } from "src/users/users.service";


@Injectable()
export class TenantAdminGuard implements CanActivate {
    constructor(
        private readonly tenantsService: TenantsService,
        private readonly rolesService: RolesService,
        private readonly usersService: UsersService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const user: AuthUser = req.user;
        const slug: string = req.params.slug;

        if (!user) {
            throw new UnauthorizedException('Not authenticated');
        }
        
        await this.usersService.ensureUserIsValid(user.id);

        const tenant = await this.tenantsService.findBySlug(slug);
        if (!tenant) {
            throw new NotFoundException('Tenant not found');
        }

        if (user.tenantId !== tenant.id) {
            throw new ForbiddenException('User does not belong to this tenant');
        }

        const isAdmin = await this.rolesService.hasRole(user.id, 'tenant:admin');
        if (!isAdmin) {
            throw new ForbiddenException('Admin role required to execute this operation');
        }

        return true;
    }
}
