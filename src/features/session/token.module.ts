import { Module } from '@nestjs/common';
import {TokenService} from "./token.service";
import {PrismaModule} from "../prisma/prisma.module";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [ConfigModule, PrismaModule],
    providers: [TokenService],
    exports: [TokenService],
})
export class TokenModule {}