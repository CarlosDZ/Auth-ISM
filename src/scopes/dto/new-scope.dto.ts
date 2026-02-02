import { IsString, IsNotEmpty, IsDate } from 'class-validator';
export class NewScopeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    tenantId: string;

    @IsDate()
    createdAt: Date;
}
