import {IsEmail, IsString, Matches, MinLength} from 'class-validator';

export class RegisterRequestDTO {
    @IsString({ message: 'Имя должно быть строкой' })
    @MinLength(2, { message: 'Имя должно содержать минимум 2 символа' })
    name: string;

    @IsEmail({}, { message: 'Некорректный email' })
    email: string;

    @IsString({ message: 'Пароль должен быть строкой' })
    @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
    @Matches(/[A-Z]/, { message: 'Пароль должен содержать минимум одну заглавную букву' })
    @Matches(/[0-9]/, { message: 'Пароль должен содержать минимум одну цифру' })
    password: string;
}

export class LoginRequestDTO {
    @IsEmail({}, { message: 'Некорректный email' })
    email: string;

    @IsString({ message: 'Пароль должен быть строкой' })
    @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
    @Matches(/[A-Z]/, { message: 'Пароль должен содержать минимум одну заглавную букву' })
    @Matches(/[0-9]/, { message: 'Пароль должен содержать минимум одну цифру' })
    password: string;
}