import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomBytes } from 'crypto';
import { GeneratedVerificationTokenDto } from './dto/verification-token.dto';

@Injectable()
export class EmailVerificationService {
    constructor(private readonly prisma: PrismaService) {}

    async generateVerificationToken(
        userId: string,
        email: string
    ): Promise<GeneratedVerificationTokenDto> {
        return await this.prisma.$transaction(async (tx) => {
            // 1 - Revoke user's old tokens
            await tx.emailVerificationToken.updateMany({
                where: {
                    userId,
                    usedAt: null,
                    revoked: false
                },
                data: {
                    revoked: true,
                    revokedAt: new Date()
                }
            });

            // 2 - Generate token data
            const token = randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 min

            // 3 - Create token register
            const record = await tx.emailVerificationToken.create({
                data: {
                    userId,
                    email,
                    token,
                    expiresAt
                }
            });

            // 4 - Return clean token data
            return {
                token: record.token,
                email: record.email,
                expiresAt: record.expiresAt,
                createdAt: record.createdAt
            };
        });
    }

    async verifyToken(token: string): Promise<{ success: true }> {
        return this.prisma.$transaction(async (tx) => {
            // 1 - Get token
            const record = await tx.emailVerificationToken.findUnique({
                where: { token },
                include: { user: true }
            });

            if (!record) {
                throw new NotFoundException('Invalid token');
            }

            // 2 - State comprobations
            if (record.revoked) {
                throw new BadRequestException('Token revoked');
            }

            if (record.usedAt) {
                throw new BadRequestException('Token already used');
            }

            if (record.expiresAt < new Date()) {
                throw new BadRequestException('Token expired');
            }

            if (record.email !== record.user.email) {
                throw new BadRequestException('Email changed since token was issued');
            }

            // 3 - Verify User
            await tx.user.update({
                where: { id: record.userId },
                data: { isVerified: true }
            });

            // 4 - Mark token as used
            await tx.emailVerificationToken.update({
                where: { id: record.id },
                data: { usedAt: new Date() }
            });

            return { success: true };
        });
    }

    async resendVerification(tenantId: string, email: string): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { tenantId_email: { tenantId, email }
         } });

        if (!user) return;

        await this.generateVerificationToken(user.id, user.email);

        // mailer
    }
}
