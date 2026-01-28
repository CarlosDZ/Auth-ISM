import { IsEmail, IsString, MaxLength } from 'class-validator';
import { IsUserPassword } from '../../users/validators/user-password.validator';

export class CreateFirstTenantAdminDto {
    @IsEmail()
    @MaxLength(192)
    email: string;

    @IsUserPassword()
    password: string;

    @IsString()
    @MaxLength(160)
    name: string;
}
