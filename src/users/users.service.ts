import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PasswordHasher } from './security/password-hasher.service';
import { Prisma } from '@prisma/client';
import { CreateFirstTenantAdminDto } from 'src/tenants/dto/create-first-tenant-admin.dto';
import { User } from '@prisma/client';
import { CreatedUserResponseDto, CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { EmailVerificationService } from 'src/auth/email-verification.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly passwordHasher: PasswordHasher,
        private readonly emailVerificationService: EmailVerificationService
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

    async registerTenantUser(
        tenantId: string,
        dto: CreateUserDto
    ): Promise<CreatedUserResponseDto> {
        const hashed = await this.passwordHasher.hash(dto.password);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                name: dto.name,
                password: hashed,
                tenantId: tenantId
            }
        });

        await this.emailVerificationService.sendVerification(tenantId, user.email);

        return {
            name: user.name,
            email: user.email
        };
    }

    async isVerified(userId: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { isVerified: true }
        });
        return !!user?.isVerified;
    }

    async ensureUserIsValid(userId: string): Promise<void> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { isVerified: true, isActive: true, deletedAt: true }
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (!user.isVerified) {
            throw new ForbiddenException('Email not verified');
        }
        if (!user.isActive) {
            throw new ForbiddenException('User is not active');
        }
        if (user.deletedAt !== null) {
            throw new ForbiddenException('User account has been deleted');
        }
    }
}
