import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dtos/auth.dto';
import type { Response, Request } from 'express';
import { JwtGuard } from './guards/jwt.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const { accessToken, refreshToken, user } = await this.authService.login(loginDto);
        this.setRefreshTokenCookie(res, refreshToken);
        return { accessToken, user };
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const { accessToken, refreshToken, user } = await this.authService.register(registerDto);
        this.setRefreshTokenCookie(res, refreshToken);
        return { accessToken, user };
    }

    @Post('refresh')
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        const refreshToken = req.cookies['refresh_token'];
        const { accessToken, refreshToken: newRefresh, user } = await this.authService.refresh(refreshToken);

        this.setRefreshTokenCookie(res, newRefresh);
        return { accessToken, user };
    }

    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@CurrentUser() user: any) {
        return user;
    }

    private setRefreshTokenCookie(res: Response, refreshToken: string) {
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }
}
