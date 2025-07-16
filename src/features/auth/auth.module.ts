import { Module } from '@nestjs/common';
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {ConfigModule} from "@nestjs/config";
import {UserModule} from "../user/user.module";
import {TokenModule} from "../session/token.module";

@Module({
    imports: [ConfigModule, UserModule, TokenModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
