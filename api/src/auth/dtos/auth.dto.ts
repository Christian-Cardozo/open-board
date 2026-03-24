import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../users/enums/user-role.enum';

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class RegisterDto {
   
    @IsString()
    @MinLength(8)
    password: string

    @IsEmail()
    email: string;

    @IsString()
    name:string;

    @IsEnum(UserRole)
    role: UserRole;
}
