import {BadRequestException, Injectable} from "@nestjs/common";
import * as jwt from 'jsonwebtoken';
import {TokenPayload, TokenType} from "./token.types";
import {PrismaService} from "../prisma/prisma.service";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class TokenService {
    private readonly accessSecret: string;
    private readonly refreshSecret: string;

    constructor(
        private config: ConfigService,
        private prisma: PrismaService,
    ) {
        const accessSecret = this.config.get('JWT_ACCESS_SECRET');
        const refreshSecret = this.config.get('JWT_REFRESH_SECRET');

        if (!accessSecret || !refreshSecret) throw new BadRequestException('JWT secrets must be set');

        this.accessSecret = accessSecret;
        this.refreshSecret = refreshSecret;
    }

    public generateTokens(payload: TokenPayload) {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        }
    }

    public generateAccessToken(payload: TokenPayload) {
        return jwt.sign(payload, this.accessSecret, { expiresIn: '15m' });
    }

    public generateRefreshToken(payload: TokenPayload) {
        return jwt.sign(payload, this.refreshSecret, { expiresIn: '7d' });
    }

    public validateToken(token: string, type: TokenType) {
        try {
            const secret = type === 'ACCESS' ? this.accessSecret : this.refreshSecret;
            return jwt.verify(token, secret) as TokenPayload;
        } catch {
            return null
        }
    }


    public async createRefreshToken(userId: string, refreshToken: string) {
        return this.prisma.session.create({
            data: {
                refreshToken,
                userId,
            }
        })
    }

    public async deleteRefreshToken(userId: string, refreshToken: string) {
        return this.prisma.session.deleteMany({
            where: {
                userId,
                refreshToken
            }
        })
    }
}