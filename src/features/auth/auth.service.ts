import * as bcrypt from 'bcrypt';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {TokenService} from '../session/token.service';
import {LoginRequestDTO, RegisterRequestDTO} from "./dto/auth.dto";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private sessionService: TokenService,
    ) {
    }

    public async register(data: RegisterRequestDTO) {
        const user = await this.userService.createUser(data);
        const {accessToken, refreshToken} = this.sessionService.generateTokens({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            }
        });

        await this.sessionService.createRefreshToken(
            user.id,
            refreshToken
        )

        return {
            user,
            accessToken,
            refreshToken,
        }
    }

    public async login(data: LoginRequestDTO) {
        const user = await this.userService.findByEmail(data.email);
        if (!user) throw new UnauthorizedException("Wrong email or password");

        const isValid = await bcrypt.compare(data.password, user.password);
        if (!isValid) throw new UnauthorizedException("Wrong email or password");

        const {accessToken, refreshToken} = this.sessionService.generateTokens({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            }
        });
        await this.sessionService.createRefreshToken(user.id, refreshToken)

        return {
            user,
            accessToken,
            refreshToken,
        }
    }
}
