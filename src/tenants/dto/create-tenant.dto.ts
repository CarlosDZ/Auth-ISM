import { CreateFirstTenantAdminDto } from './create-first-tenant-admin.dto';
import { IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsTenantSlug } from '../validators/tenant-slug.validator';

export class CreateTenantDto {
    @IsString()
    @MaxLength(192)
    name: string;

    @IsTenantSlug()
    slug: string;

    @ValidateNested()
    @Type(() => CreateFirstTenantAdminDto)
    admin: CreateFirstTenantAdminDto;
    //May put here -- metadata: Json;
}
