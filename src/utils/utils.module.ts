import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TenantLookupService } from './tenant-lookup.service';
import { ScopeLookupService } from './scope-lookup.service';
import { RoleLookupService } from './role-lookup.service';
import { UserLookupService } from './user-lookup.service';

@Module({
    providers: [
        TenantLookupService,
        ScopeLookupService,
        RoleLookupService,
        UserLookupService,
        PrismaService
    ],
    exports: [TenantLookupService, ScopeLookupService, RoleLookupService, UserLookupService]
})
export class UtilsModule {}
