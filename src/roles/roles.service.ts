import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class RolesService {
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
}
