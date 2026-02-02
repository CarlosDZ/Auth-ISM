import { Injectable } from '@nestjs/common';
import { PasswordHasher } from './security/password-hasher.service';
import { Prisma } from '@prisma/client';
import { CreateFirstTenantAdminDto } from 'src/tenants/dto/create-first-tenant-admin.dto';
import { User } from '@prisma/client';
import { CreatedUserResponseDto, CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly passwordHasher: PasswordHasher
    ) {}

    async createTenantAdmin(
        tx: Prisma.TransactionClient,
        tenantId: string,
        admin: CreateFirstTenantAdminDto
    ): Promise<User> {
        const hashed = await this.passwordHasher.hash(admin.password);

        return await tx.user.create({
            data: {
                email: admin.email,
                password: hashed,
                name: admin.name,
                tenantId
            }
        });
    }

    async registerTenantUser(tenantId: string, dto: CreateUserDto): Promise<CreatedUserResponseDto> {
        const hashed = await this.passwordHasher.hash(dto.password);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                name: dto.name,
                password: hashed,
                tenantId: tenantId
            }
        });

        return {
            name:user.name,
            email:user.email
        }
    }
}
