import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { AuthUser } from '../types/auth-user.type';
import { TenantLookupService } from 'src/utils/tenant-lookup.service';
import { PrismaService } from 'prisma/prisma.service';
import { RoleLookupService } from 'src/utils/role-lookup.service';

@Injectable()
export class TenantAdminGuard implements CanActivate {
    constructor(
        private readonly tenantLookupService: TenantLookupService,
        private readonly roleLookupService: RoleLookupService,
        private readonly prisma: PrismaService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const authUser: AuthUser = req.user;
        const slug: string = req.params.slug;

        console.log('REQ USER:', req.user);

        if (!authUser) {
            throw new UnauthorizedException('Not authenticated');
        }

        const user = await this.prisma.user.findUnique({
            where: { id: authUser.id }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (!user.isVerified) {
            throw new ForbiddenException('Email not verified');
        }
        if (!user.isActive) {
            throw new ForbiddenException('User is not active');
        }
        if (user.deletedAt !== null) {
            throw new ForbiddenException('User account has been deleted');
        }

        const tenant = await this.tenantLookupService.findBySlug(slug);
        if (!tenant) {
            throw new NotFoundException('Tenant not found');
        }

        if (user.tenantId !== tenant.id) {
            throw new ForbiddenException('User does not belong to this tenant');
        }

        const isAdmin = await this.roleLookupService.hasRole(user.id, 'tenant:admin');
        if (!isAdmin) {
            throw new ForbiddenException('Admin role required to execute this operation');
        }

        return true;
    }
}
