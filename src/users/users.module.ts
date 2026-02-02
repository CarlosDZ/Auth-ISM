import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SecurityModule } from './security/security.module';
import { PrismaService } from 'prisma/prisma.service';

@Module({
    imports: [SecurityModule],
    providers: [UsersService, PrismaService],
    exports: [UsersService]
})
export class UsersModule {}
