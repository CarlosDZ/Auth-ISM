import { IsDate, IsEmail, IsString, Length, MaxLength } from 'class-validator';

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
    @Length(64, 64)
    token: string;

    @IsDate()
    expiresAt: Date;

    @IsDate()
    createdAt: Date;
}

export class VerifyEmailDto {
    @IsString()
    @Length(64, 64)
    token: string;
}
