import {Controller, Get, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {User} from "../../common/decorators/user.decorator";

@Controller('user')
export class UserController {
    constructor() {
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@User() user: any) {
        return {user};
    }
}
