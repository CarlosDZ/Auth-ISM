import { IsString, IsEmail, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @MaxLength(192)
    email: string;

    @MinLength(8)
    @MaxLength(128)
    password: string;
    
    @IsString()
    @MaxLength(192)
    name: string;

    @IsString()
    tenantId: string;
}

