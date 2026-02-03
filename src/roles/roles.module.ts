import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RolesService } from 'src/roles/roles.service';
import { UtilsModule } from 'src/utils/utils.module';
import { RolesController } from './roles.controller';

@Module({
    imports: [UtilsModule],
    controllers: [RolesController],
    providers: [RolesService, PrismaService],
    exports: [RolesModule]
})
export class RolesModule {}
