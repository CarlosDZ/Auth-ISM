import { Body, Controller, Post, Param } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { CreateVerificationTokenDto } from 'src/auth/dto/verification-token.dto';
import { EmailVerificationService } from 'src/auth/email-verification.service';
import { TenantLookupService } from 'src/utils/tenant-lookup.service';
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
    constructor(
        private readonly tenantLookupService: TenantLookupService,
        private readonly tenantsService: TenantsService,
        private readonly emailVerificationService: EmailVerificationService
    ) {}

    @Post() async createTenant(@Body() dto: CreateTenantDto) {
        return this.tenantsService.registerTenant(dto);
    }

    @Post(':slug/send-verification')
    async resend(@Param('slug') slug: string, @Body() dto: CreateVerificationTokenDto) {
        const tenant = await this.tenantLookupService.findBySlug(slug);

        await this.emailVerificationService.sendVerification(tenant.id, dto.email);

        return {
            message: 'If the email exists, a new verification link was sent.'
        };
    }
}
