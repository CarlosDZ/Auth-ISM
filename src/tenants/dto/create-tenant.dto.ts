import { CreateFirstTenantAdminDto } from './create-first-tenant-admin.dto';
import { IsString, Matches, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTenantDto {
    @IsString()
    @MaxLength(192)
    name: string;

    @Matches(/^[a-z0-9-]+$/, { message: 'slug must contain only lowercase letters, numbers and hyphens', })
    @MaxLength(64)
    slug: string;

    @ValidateNested()
    @Type(() => CreateFirstTenantAdminDto)
    admin: CreateFirstTenantAdminDto;
    //May put here -- metadata: Json;
}
