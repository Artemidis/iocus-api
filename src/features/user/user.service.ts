import {ConflictException, Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {PrismaService} from '../prisma/prisma.service';
import {Prisma, User} from '@prisma/client';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
    ) {
    }

    public async createUser(data: Prisma.UserCreateInput): Promise<User> {
        await this.checkUserExists(data.email)

        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hashedPassword,
            }
        })
    }

    public async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({where: {email}})
    }

    public async findByRefreshToken(refreshToken: string): Promise<User | null> {
        try {
            const session = await this.prisma.session.findUniqueOrThrow({
                where: {refreshToken},
                include: {
                    user: true
                }
            })
            return session.user
        } catch {
            return null
        }
    }


    private async checkUserExists(email: string) {
        const existingUser = await this.prisma.user.findUnique({where: {email}})
        if (existingUser) throw new ConflictException('User already exists');
    }
}
