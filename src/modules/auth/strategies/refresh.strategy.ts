import { Injectable, OnModuleInit } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'shared/lib/services/auth.service';
import { Request } from 'express';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { grpcClientOptions } from 'shared/lib/options/auth.grpc';
import { IRefreshPayload } from 'shared/lib/transfer/auth.dto';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class RefreshStrategy
  extends PassportStrategy(Strategy, 'refresh')
  implements OnModuleInit
{
  @Client(grpcClientOptions) private client: ClientGrpc;
  private authService: AuthService;

  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request?.cookies?.Refresh,
      ]),
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
  }

  async validate(req: Request, { id }: IRefreshPayload) {
    const refreshToken: string = req.cookies?.Refresh;
    const res = await firstValueFrom(
      this.authService
        .getRefreshTokenIsValid({
          userId: id,
          refreshToken,
        })
        .pipe(map((x) => x.value)),
    );
    return res;
  }
}
