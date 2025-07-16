import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {TokenService} from "../session/token.service";
import {UserService} from "../user/user.service";
import {Response} from "express";
import {setAuthCookies} from "../../common/cookie.helper";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private tokenService: TokenService,
        private userService: UserService,
    ) {
    }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const response: Response = context.switchToHttp().getResponse();

        const {accessToken, refreshToken} = request.cookies;

        let accessPayload = null;
        if (accessToken) {
            accessPayload = this.tokenService.validateToken(accessToken, 'ACCESS')
        }

        if (accessPayload) {
            const {user} = accessPayload
            const newAccessToken = this.tokenService.generateAccessToken({ user })

            request.user = {
                id: user.id,
                email: user.email,
                name: user.name,
            };

            setAuthCookies(response, newAccessToken);
        } else {
            if (!refreshToken) throw new UnauthorizedException("Refresh token not found");

            const refreshPayload = this.tokenService.validateToken(refreshToken, 'REFRESH')
            if (!refreshPayload) throw new UnauthorizedException("Invalid refresh token");

            const user = await this.userService.findByRefreshToken(refreshToken)
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            const {accessToken: newAccessToken, refreshToken: newRefreshToken} = this.tokenService.generateTokens({ user })
            await this.tokenService.deleteRefreshToken(user.id, refreshToken)
            await this.tokenService.createRefreshToken(user.id, refreshToken)

            setAuthCookies(response, newAccessToken, newRefreshToken);

            request.user = {
                id: user.id,
                email: user.email,
                name: user.name,
            };
        }

        return true;
    }
}