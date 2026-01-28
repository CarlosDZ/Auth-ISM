import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class CreateFirstTenantAdminDto {
    @IsEmail()
    @MaxLength(192)
    email: string;

    @MinLength(8)
    @MaxLength(128)
    password: string;

    @IsString()
    @MaxLength(192)
    name: string;
}