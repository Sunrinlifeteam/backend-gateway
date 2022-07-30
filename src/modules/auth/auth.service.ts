import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { grpcClientOptions } from 'src/shared/options/user.grpc';
import { UserService } from 'src/shared/services/user.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  @Client(grpcClientOptions) private readonly client: ClientGrpc;
  private userService: UserService;

  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
  }

  async validateUser(user_id: string, password: string): Promise<any> {
    //
  }

  async googleLogin(req) {
    const { user } = req.user;
    const savedUser = await this.userService.getUserByEmail({
      value: user.email,
    });
    const isNewUser = !savedUser;
  }

  createAndGetAccessTokenByUserId(id: string): string {
    return this.jwt.sign(
      { id },
      {
        secret: this.config.get('ACCESS_TOKEN_SECRET'),
        expiresIn: this.config.get('ACCESS_TOKEN_EXPIRES_IN'),
      },
    );
  }

  async createAndGetRefreshTokenByUserId(id: string): Promise<string> {
    const refreshToken = this.jwt.sign(
      { id },
      {
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
        expiresIn: this.config.get('REFRESH_TOKEN_EXPIRES_IN'),
      },
    );
    await this.userService.setUserRefreshToken(
      { value: id },
      { value: refreshToken },
    );
    return refreshToken;
  }
}
