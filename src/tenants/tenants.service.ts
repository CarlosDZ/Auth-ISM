import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';
import { TenantWithAdminResponse } from './types/tenant-with-admin-response.interface';
import { EmailVerificationService } from 'src/auth/email-verification.service';

@Injectable()
export class TenantsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly usersService: UsersService,
        private readonly rolesService: RolesService,
        private readonly emailVerificationService: EmailVerificationService
    ) {}

    async createTenant(dto: CreateTenantDto): Promise<TenantWithAdminResponse> {
        const { name, slug, admin } = dto;

        return this.prisma.$transaction<TenantWithAdminResponse>(
            async (tx): Promise<TenantWithAdminResponse> => {
                // 1 - Slug not taken
                const existing = await tx.tenant.findUnique({ where: { slug } });
                if (existing) {
                    throw new ConflictException('Tenant slug already exists');
                }

                // 2 - Tenant creation
                const tenant = await tx.tenant.create({
                    data: {
                        name,
                        slug
                    }
                });

                // 3 - Admin Role creation
                const adminRole = await this.rolesService.createTenantAdminRole(tx, tenant.id);

                // 4 - Tenant admin creation
                const adminUser = await this.usersService.createTenantAdmin(tx, tenant.id, admin);

                // 5 - Assign role to user
                await this.rolesService.autoAssignAdminRole(tx, adminUser.id, adminRole.id);

                return {
                    tenant: {
                        id: tenant.id,
                        name: tenant.name,
                        slug: tenant.slug,
                        createdAt: tenant.createdAt
                    },
                    admin: {
                        id: adminUser.id,
                        email: adminUser.email,
                        name: adminUser.name,
                        createdAt: adminUser.createdAt
                    }
                };
            }
        );
    }

    async registerTenant(dto: CreateTenantDto): Promise<TenantWithAdminResponse> {
        // 1 - SQL Transaction
        const result = await this.createTenant(dto);

        // 2 - Exec the service
        await this.emailVerificationService.sendVerification(result.tenant.id, result.admin.email);

        return result;
    }
}
