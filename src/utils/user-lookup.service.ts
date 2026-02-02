import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserLookupService {
    constructor(private readonly prisma: PrismaService) {}

    async findOnTenant(email: string, tenantId: string) {
        const user = await this.prisma.user.findUnique({
            where: { tenantId_email: { tenantId, email } }
        });

        if (!user) {
            throw new NotFoundException(`User ${email} not found on tenant "${tenantId}`);
        }

        return user;
    }
}
