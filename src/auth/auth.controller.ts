import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.param.decorator';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

class LoginDto {
  @IsNotEmpty()
  loginOrEmail: 'string';
  @IsNotEmpty()
  password: 'string';
}

class RegistrationDto {
  @IsNotEmpty()
  login: 'string';
  @IsNotEmpty()
  password: 'string';
  @IsEmail()
  email: 'string';
}

class RegistrationConfirmationDTO {
  @IsNotEmpty()
  code: string;
}

class EmailDto {
  @IsEmail()
  email: string;
}

class CreateNewPassDto {
  @MinLength(6)
  @MaxLength(20)
  newPassword: string;

  @IsNotEmpty()
  recoveryCode: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(204)
  @Post('registration')
  @UseGuards(ThrottlerGuard)
  @Throttle(5, 10)
  async registration(@Body() dto: RegistrationDto) {
    await this.authService.registration(dto.login, dto.password, dto.email);
    return;
  }

  @HttpCode(HttpStatus.OK)
  @Post('registration-confirmation')
  @UseGuards(ThrottlerGuard)
  @Throttle(5, 10)
  async registrationConfirmation(@Body() dto: RegistrationConfirmationDTO) {
    return await this.authService.registrationConfirmation(dto.code);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('password-recovery')
  @UseGuards(ThrottlerGuard)
  @Throttle(5, 10)
  async passwordRecovery(@Body() dto: EmailDto) {
    return await this.authService.passwordRecovery(dto.email);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('new-password')
  @UseGuards(ThrottlerGuard)
  @Throttle(5, 10)
  async createNewPassword(@Body() dto: CreateNewPassDto) {
    return await this.authService.createNewPassword(
      dto.newPassword,
      dto.recoveryCode,
    );
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @UseGuards(ThrottlerGuard)
  @Throttle(5, 10)
  async login(
    @CurrentUser() currentUser,
    @Body() dto: LoginDto,
    @Res() response: Response,
    @Req() req: Request,
  ) {
    const { ip } = req;
    const userAgent = req.headers['user-agent'];
    const tokens = await this.authService.login(
      currentUser.userId,
      ip,
      userAgent,
    );
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    response.status(200).json({ accessToken: tokens.accessToken });
    return;
  }

  @HttpCode(HttpStatus.OK)
  @Post('registration-email-resending')
  @UseGuards(ThrottlerGuard)
  @Throttle(5, 10)
  async resendingCodeOnRegistration(@Body() dto: EmailDto) {
    await this.authService.resendingCodeOnRegistration(dto.email);
    return;
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() response: Response) {
    const { refreshToken } = req.cookies;

    const tokens = await this.authService.refreshToken(refreshToken);
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    response.status(200).json({ accessToken: tokens.accessToken });
    return;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(@Req() req: Request) {
    const { refreshToken } = req.cookies;
    const { sub: userId } = await this.authService.verifyToken(refreshToken);
    await this.authService.logout(userId, refreshToken);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async getCurrentUserInfo(@CurrentUser() currentUser) {
    return await this.authService.getCurrentUserInfo(currentUser.userId);
  }
}
