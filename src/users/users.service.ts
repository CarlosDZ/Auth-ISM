import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PasswordHasher } from './security/password-hasher.service';
import { Prisma } from '@prisma/client';
import { CreateFirstTenantAdminDto } from 'src/tenants/dto/create-first-tenant-admin.dto';
import { User } from '@prisma/client';
import { CreatedUserResponseDto, CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { EmailVerificationService } from 'src/auth/mail-verification/email-verification.service';

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

    async assignRoleToUser(tenantId: string, userId: string, roleId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        const role = await this.prisma.role.findUnique({
            where: { id: roleId }
        });

        await this.ensureUserIsValid(userId);

        if (!role) {
            throw new NotFoundException('Role not found');
        }
        if (!role.isActive) {
            throw new ForbiddenException('Role is not active');
        }
        if (user?.tenantId !== tenantId) {
            throw new ForbiddenException('User does not beelong to this tenant.');
        }
        if (role.tenantId !== tenantId) {
            throw new ForbiddenException('Role does not beelong to this tenant.');
        }

        const previous = await this.prisma.userRole.findUnique({
            where: { userId_roleId: { userId, roleId } }
        });

        if (previous) {
            return 'This role was already assigned to this user, nothing changed.';
        }

        const relation = await this.prisma.userRole.create({
            data: {
                userId,
                roleId
            }
        });
        if (relation) {
            return 'Role assigned successfully';
        }
        return;
    }

    async deleteRoleFromUser(tenantId: string, userId: string, roleId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        const role = await this.prisma.role.findUnique({
            where: { id: roleId }
        });

        await this.ensureUserIsValid(userId);

        if (!role) {
            throw new NotFoundException('Role not found');
        }
        if (!role.isActive) {
            throw new ForbiddenException('Role is not active');
        }
        if (user?.tenantId !== tenantId) {
            throw new ForbiddenException('User does not beelong to this tenant.');
        }
        if (role.tenantId !== tenantId) {
            throw new ForbiddenException('Role does not beelong to this tenant.');
        }

        const objective = await this.prisma.userRole.findUnique({
            where: { userId_roleId: { userId, roleId } }
        });

        if (!objective) {
            return 'This role wasnt assigned to this user, nothing changed.';
        }

        await this.prisma.userRole.delete({ where: { userId_roleId: { userId, roleId } } });
        return 'Role deleted from user successfully.';
    }

    async getUserRoles(userId: string) {
        const roles = await this.prisma.userRole.findMany({
            where: { userId },
            include: {
                role: true
            }
        });

        return roles.map((r) => r.role);
    }
}
