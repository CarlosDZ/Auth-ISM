import { Injectable } from "@nestjs/common";
import { PasswordHasher } from "./security/password-hasher.service";
import { Prisma } from "@prisma/client";
import { CreateFirstTenantAdminDto } from "src/tenants/dto/create-first-tenant-admin.dto";
import { User } from "@prisma/client";

@Injectable()
export class UsersService {
    constructor(private readonly passwordHasher: PasswordHasher) {}

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
}
