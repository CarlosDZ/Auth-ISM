import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class TenantLookupService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async findBySlug(slug: string) {
            const tenant = await this.prisma.tenant.findUnique({
                where: { slug }
            });
    
            if (!tenant) {
                throw new NotFoundException(`Tenant with slug "${slug}" not found`);
            }
    
            return tenant;
        }
    }