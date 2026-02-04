import {
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
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

        const valid = await this.passwordHasher.verify(user.password, dto.password);

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
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
            }
        });

        const accessToken = this.jwtService.sign(
            {
                sub: user.id,
                tenantId: user.tenantId,
                sessionId: session.id
            },
            {
                expiresIn: '20m'
            }
        );

        const refreshToken = session.id;

        return {
            accessToken,
            refreshToken
        };
    }

    async refresh(refreshToken: string, ip: string, userAgent: string) {
        if (!ip || ip == '') {
            throw new UnauthorizedException(
                'Request IP is not sent or null, please create a new ACCESS and REFRESH session login in instead of refreshing with this one'
            );
        }
        if (!userAgent || userAgent == '') {
            throw new UnauthorizedException(
                'Request UserAgent is not sent or null, please create a new ACCESS and REFRESH session login in instead of refreshing with this one.'
            );
        }

        const session = await this.prisma.session.findUnique({ where: { id: refreshToken } });

        if (!session || session.revokedAt || session.expiresAt < new Date()) {
            throw new UnauthorizedException(
                'Refresh token is either unexistant, revoked manually or expired. Generate a new one through login in.'
            );
        }
        if (!session.ipAddress || !session.userAgent) {
            throw new ForbiddenException(
                'Refresh token was registered without using a valid IP or UserAgent, thus not being secure for refreshing. Generate a new one through login in.'
            );
        }
        if (session.ipAddress != ip) {
            throw new ForbiddenException(
                'Request IP address is not the same as the IP used to generate the REFRESH token. Generate a new one through login in.'
            );
        }
        if (session.userAgent != userAgent) {
            throw new ForbiddenException(
                'Request UserAgent address is not the same as the UserAgent used to generate the REFRESH token. Generate a new one through login in.'
            );
        } else {
            const payload = {
                sub: session.userId,
                tenantId: session.tenantId,
                sessionId: session.id
            };
            const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '20' });

            await this.prisma.session.update({
                where: { id: session.id },
                data: {
                    revokedAt: new Date(),
                    revokedBy: 'AuthISM token refreshing service',
                    lastActivity: new Date()
                }
            });
            const newSession = await this.prisma.session.create({
                data: {
                    userId: session.userId,
                    tenantId: session.tenantId,
                    type: 'REFRESH',
                    ipAddress: ip,
                    userAgent: userAgent,
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                }
            });
            const newRefreshToken = newSession.id;

            return {
                message: 'REFRESH token rotated, heres your new SESSION and REFRESH token',
                accessToken,
                refreshToken: newRefreshToken
            };
        }
    }
}
