import { Tenant, User } from '@prisma/client';

export interface TenantWithAdmin {
    tenant: Tenant;
    admin: User;
}
