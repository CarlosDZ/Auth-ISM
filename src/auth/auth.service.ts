import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PasswordHasher } from 'src/users/security/password-hasher.service';
import { LoginDataDto } from './dto/login-data.dto';
import { TenantLookupService } from 'src/utils/tenant-lookup.service';
import { UserLookupService } from 'src/utils/user-lookup.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly passwordHasher: PasswordHasher,
        private readonly tenantLookupService: TenantLookupService,
        private readonly userLookupService: UserLookupService,
        private readonly jwtService: JwtService
    ) {}

    async login(slug: string, dto: LoginDataDto, ip: string, userAgent: string) {
        const tenant = await this.tenantLookupService.findBySlug(slug);

        if (!tenant) {
            throw new NotFoundException('No tenant found for this slug.');
        }

        const user = await this.userLookupService.findOnTenant(dto.email, tenant.id);

        if (!user) {
            throw new ForbiddenException(
                'Either there is no active user with this email on the tenant, or the password is wrong'
            );
        }

        const valid = await this.passwordHasher.verify(user.password, dto.passoword);

        if (!valid) {
            throw new ForbiddenException(
                'Either there is no active user with this email on the tenant, or the password is wrong'
            );
        }

        const session = await this.prisma.session.create({
            data: {
                userId: user.id,
                tenantId: user.tenantId,
                type: 'REFRESH',
                ipAddress: ip,
                userAgent,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
            }
        });

        const accessToken = this.jwtService.sign({
            sub: user.id,
            tenantId: user.tenantId,
            sessionId: session.id
        },
    {
        expiresIn: '20m'
    });

        const refreshToken = session.id;

        return {
            accessToken,
            refreshToken
        };
    }
}
