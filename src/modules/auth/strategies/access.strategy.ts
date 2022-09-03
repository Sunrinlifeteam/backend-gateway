import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { config as envConfig } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'shared/lib/access/user.dao';
import { AuthService } from 'shared/lib/services/auth.service';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { grpcClientOptions } from 'shared/lib/options/auth.grpc';
import { User } from 'shared/lib/transfer/user.dto';
import { IAccessPayload } from 'shared/lib/transfer/auth.dto';
import { lastValueFrom } from 'rxjs';

envConfig();

@Injectable()
export class AccessStrategy
  extends PassportStrategy(Strategy, 'access')
  implements OnModuleInit
{
  @Client(grpcClientOptions) private client: ClientGrpc;
  private authService: AuthService;

  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
  }

  async validate(payload: IAccessPayload): Promise<User> {
    return await lastValueFrom(this.authService.accessValidate(payload));
  }
}
