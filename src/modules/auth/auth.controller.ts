import {
  Controller,
  Get,
  OnModuleInit,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import {
  REFRESH_TOKEN_COOKIE_KEY,
  REFRESH_TOKEN_COOKIE_OPTION,
} from 'src/shared/constants';
import { grpcClientOptions } from 'src/shared/options/auth.grpc';
import { AuthService } from 'src/shared/services/auth.service';
import { GoogleGuard } from './guards/google.guard';
import { RefreshGuard } from './guards/refresh.guard';

@Controller('auth')
export class AuthController implements OnModuleInit {
  @Client(grpcClientOptions) private client: ClientGrpc;
  private readonly FRONTEND_URL: string;
  private authService: AuthService;

  constructor(private readonly config: ConfigService) {
    this.FRONTEND_URL = config.get('FRONTEND_URL');
  }

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    this.authService
      .getRefreshTokenAndIsNewUserByLogin(req.user)
      .subscribe(({ refreshToken, isNewUser }) => {
        res.cookie(
          REFRESH_TOKEN_COOKIE_KEY,
          refreshToken,
          REFRESH_TOKEN_COOKIE_OPTION,
        );

        return res.redirect(this.FRONTEND_URL + (isNewUser ? '/register' : ''));
      });
  }

  @Get('refresh')
  @UseGuards(RefreshGuard)
  async refreshAccessToken(@Req() req: Request, @Res() res: Response) {
    const { accessToken } = await firstValueFrom(
      this.authService.getAccessToken({
        userId: req.user.id,
      }),
    );
    res.json({ accessToken });
  }
}
// --------------------------------------------------------------------------------------------------------------------
// End of generated code
// --------------------------------------------------------------------------------------------------------------------
// Language: typescript
// Path: packages\gateway\src\shared\modules\auth\auth.module.ts
// Compare this snippet from packages\gateway\src\shared\modules\auth\auth.module.ts:
// import { Module } from '@nestjs/common';
//
// @Module({
//   imports: [],
//   controllers: [],
//   providers: [],
// })
// export class AuthModule {}
//
