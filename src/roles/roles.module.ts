import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RolesService } from 'src/roles/roles.service';

@Module({
    imports: [],
    controllers: [],
    providers: [RolesService, PrismaService],
    exports: [RolesModule]
})
export class RolesModule {}
