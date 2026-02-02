import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ScopeLookupService {
    constructor(private readonly prisma: PrismaService) {}

    async findOnTenant(name: string, tenantId: string) {
        const scope = await this.prisma.scope.findUnique({
            where: { tenantId_name: { tenantId, name } }
        });

        if (!scope) {
            throw new NotFoundException(`Scope ${name} not found on tenant "${tenantId}`);
        }

        return scope;
    }
}
