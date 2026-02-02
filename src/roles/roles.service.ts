import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException
} from '@nestjs/common';
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

    async assignScopeToRole(tenantId: string, roleId: string, scopeId: string) {
        const role = await this.prisma.role.findUnique({ where: { id: roleId } });
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        const scope = await this.prisma.scope.findUnique({ where: { id: scopeId } });
        if (!scope) {
            throw new NotFoundException('Scope not found');
        }
        if (role.tenantId !== tenantId) {
            throw new ForbiddenException('Role does not belong to this tenant');
        }
        if (scope.tenantId !== tenantId) {
            throw new ForbiddenException('Scope does not belong to this tenant');
        }
        const existing = await this.prisma.roleScope.findUnique({
            where: { roleId_scopeId: { roleId, scopeId } }
        });
        if (existing) {
            throw new ConflictException('Scope is already assigned to this role');
        }
        const relation = await this.prisma.roleScope.create({ data: { roleId, scopeId } });
        return { message: 'Scope assigned to role successfully', relation };
    }

    async deleteRoleScopeRelation(tenantId: string, roleId: string, scopeId: string) {
        const role = await this.prisma.role.findUnique({ where: { id: roleId } });
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        const scope = await this.prisma.scope.findUnique({ where: { id: scopeId } });
        if (!scope) {
            throw new NotFoundException('Scope not found');
        }
        if (role.tenantId !== tenantId) {
            throw new ForbiddenException('Role does not belong to this tenant');
        }
        if (scope.tenantId !== tenantId) {
            throw new ForbiddenException('Scope does not belong to this tenant');
        }
        const existing = await this.prisma.roleScope.findUnique({
            where: { roleId_scopeId: { roleId, scopeId } }
        });
        if (!existing) {
            throw new ConflictException('This scope is not assigned to this role');
        }
        await this.prisma.roleScope.delete({ where: { roleId_scopeId: { roleId, scopeId } } });
        return { message: 'Scope deleted from this role successfully' };
    }

}
