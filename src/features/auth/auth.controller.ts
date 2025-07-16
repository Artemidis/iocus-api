import {Body, Controller, Post, Res} from '@nestjs/common';
import {Response} from "express";
import {AuthService} from "./auth.service";
import {setAuthCookies} from "../../common/cookie.helper";
import {LoginRequestDTO, RegisterRequestDTO} from "./dto/auth.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {
    }

    @Post('register')
    async register(@Body() data: RegisterRequestDTO, @Res({passthrough: true}) res: Response) {
        const {user, accessToken, refreshToken} = await this.authService.register(data);

        setAuthCookies(res, accessToken, refreshToken)

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            }
        }
    }

    @Post('login')
    async login(@Body() data: LoginRequestDTO, @Res({passthrough: true}) res: Response) {
        const {user, accessToken, refreshToken} = await this.authService.login(data);

        setAuthCookies(res, accessToken, refreshToken)

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            }
        }
    }
}
