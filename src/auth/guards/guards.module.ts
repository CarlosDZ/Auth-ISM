import { Module } from '@nestjs/common';
import { RolesModule } from 'src/roles/roles.module';
import { UtilsModule } from 'src/utils/utils.module';
import { TenantAdminGuard } from './tenant-admin.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaService } from 'prisma/prisma.service';
@Module({
    imports: [UtilsModule, RolesModule],
    providers: [TenantAdminGuard, JwtAuthGuard, PrismaService],
    exports: [GuardsModule]
})
export class GuardsModule {}
