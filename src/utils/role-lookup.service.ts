import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RoleLookupService {
    constructor(private readonly prisma: PrismaService) {}

    async findOnTenant(name: string, tenantId: string) {
        const role = await this.prisma.role.findUnique({
            where: { tenantId_name: { tenantId, name } }
        });

        if (!role) {
            throw new NotFoundException(`Role ${name} not found on tenant "${tenantId}`);
        }

        return role;
    }
}
