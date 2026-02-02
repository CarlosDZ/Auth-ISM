import { IsDate, IsEmail, IsString, MaxLength } from 'class-validator';

export class CreateVerificationTokenDto {
    @IsEmail()
    @MaxLength(192)
    email: string;
}

export class GeneratedVerificationTokenDto {
    @IsEmail()
    @MaxLength(192)
    email: string;

    @IsString()
    token: string;

    @IsDate()
    expiresAt: Date;

    @IsDate()
    createdAt: Date;
}
