import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { NewRoleDto } from './dto/new-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
    constructor(private readonly prisma: PrismaService) {}
    async createTenantAdminRole(tx: Prisma.TransactionClient, tenantId: string) {
        return await tx.role.create({
            data: {
                name: 'tenant:admin',
                tenantId
            }
        });
    }

    async autoAssignAdminRole(tx: Prisma.TransactionClient, userId: string, roleId: string) {
        return await tx.userRole.create({
            data: {
                userId,
                roleId
            }
        });
    }

    async hasRole(userId: string, roleName: string): Promise<boolean> {
        const role = await this.prisma.role.findFirst({
            where: { name: roleName, users: { some: { userId: userId } } },
            select: { id: true }
        });
        return !!role;
    }

    async createRole(tenantId: string, dto: CreateRoleDto): Promise<NewRoleDto> {
        const newRole = await this.prisma.role.create({
            data: {
                name: dto.name,
                tenantId: tenantId
            }
        });

        return {
            name: newRole.name,
            tenantId: newRole.tenantId,
            createdAt: newRole.createdAt
        };
    }
}
