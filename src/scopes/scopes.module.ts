import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ScopesService } from './scopes.service';
import { ScopesController } from './scopes.controller';
import { SecurityModule } from 'src/users/security/security.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
    imports: [SecurityModule, UtilsModule],
    controllers: [ScopesController],
    providers: [ScopesService, PrismaService],
    exports: [ScopesService]
})
export class ScopesModule {}
