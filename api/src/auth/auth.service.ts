import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dtos/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) { }

    async login(loginDto: LoginDto): Promise<any> {

        const { email, password } = loginDto;

        const existingUser = await this.usersService.findByEmail(email)

        if (!existingUser) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateTokens(existingUser);
    }

    async register(registerDto: RegisterDto): Promise<any> {

        const { email, password, name, role } = registerDto;
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const newUser = await this.usersService.create({
            email,
            name,
            password: await bcrypt.hash(password, 10),
            role
        });

        return this.generateTokens(newUser);
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        let payload: any;
        try {
            payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET
            });
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const user = await this.usersService.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        return this.generateTokens(user);
    }

    private async generateTokens(user: User) {
        const { password, deletedAt, ...userResponse } = user;
        const accessToken = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role }, { secret: process.env.JWT_SECRET, expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(
            { sub: user.id },
            { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' }
        );
        return { accessToken, refreshToken, user: userResponse };
    }
}
