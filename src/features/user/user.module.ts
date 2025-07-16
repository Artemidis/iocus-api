import { Module } from '@nestjs/common';
import {UserService} from "./user.service";
import {UserController} from "./user.controller";
import {PrismaModule} from "../prisma/prisma.module";
import {TokenModule} from "../session/token.module";

@Module({
    imports: [PrismaModule, TokenModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
