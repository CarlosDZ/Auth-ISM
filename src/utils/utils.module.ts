import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TenantLookupService } from './tenant-lookup.service';

@Module({
    providers: [TenantLookupService, PrismaService],
    exports: [TenantLookupService]
})
export class UtilsModule {}
