import { IsString, IsNotEmpty, IsDate } from 'class-validator';
export class NewRoleDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    tenantId: string;

    @IsDate()
    createdAt: Date;
}
