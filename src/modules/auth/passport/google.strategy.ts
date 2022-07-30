import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUser } from 'src/shared/transfer/user.dto';
import {
  ACCOUNT_TYPE,
  SUNRIN_STUDENT_EMAIL_PATTERN,
} from 'src/shared/constants';
import { getDepartmentByClass, isNumeric } from 'src/shared/functions';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly config: ConfigService) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
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
      const userClass = +givenName.substring(1, 3);
      const user: CreateUser = {
        email,
        username: familyName,
        department: getDepartmentByClass(userClass),
        grade: +givenName.substring(0, 1),
        class: userClass,
        number: +givenName.substring(3, 5),
        accountType: ACCOUNT_TYPE.STUDENT,
        roleFlag: 0,
        description: '',
        githubLink: '',
        image: '',
        backgroundImage: '',
        clubId: 0,
      };
      return done(null, user);
    }
    return done(null, false, { reason: 'Unauthorized' });
  }
}
