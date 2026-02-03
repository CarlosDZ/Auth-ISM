import { IsEmail, MaxLength } from 'class-validator';
import { IsUserPassword } from 'src/users/validators/user-password.validator';

export class LoginDataDto {
    @IsEmail()
    @MaxLength(192)
    email: string;

    @IsUserPassword()
    password: string;
}
