import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config as envConfig } from 'dotenv';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SUNRIN_STUDENT_EMAIL_PATTERN,
  ACCOUNT_TYPE,
} from 'shared/lib/constants';
import { isNumeric, getDepartmentByClass } from 'shared/lib/functions';
import { UserService } from 'shared/lib/services/user.service';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { grpcClientOptions as userGrpc } from 'shared/lib/options/user.grpc';

envConfig();

@Injectable()
export class GoogleStrategy
  extends PassportStrategy(Strategy, 'google')
  implements OnModuleInit
{
  @Client(userGrpc) private client: ClientGrpc;
  private userService: UserService;

  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    let { familyName, givenName } = profile.name;
    const email = profile.emails[0].value;
    if (SUNRIN_STUDENT_EMAIL_PATTERN.test(email)) {
      if (isNumeric(familyName))
        givenName = [familyName, (familyName = givenName)][0];
      const userClass = parseInt(givenName.substring(1, 3));
      const user = {
        id: 'uninitialized user',
        email,
        username: familyName,
        department: getDepartmentByClass(userClass),
        grade: +givenName.substring(0, 1),
        class: userClass,
        number: +givenName.substring(3, 5),
        accountType: ACCOUNT_TYPE.STUDENT,
        role: 0,
        createdDate: new Date(),
        updatedDate: new Date(),
      };
      return done(null, user);
    }
    return done(null, null, { reason: 'Unauthorized' });
  }
}
