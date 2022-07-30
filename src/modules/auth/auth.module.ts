// import { Module } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { GoogleStrategy } from './passport/google.strategy';
// import { LocalStrategy } from './passport/local.strategy';

// @Module({
//   imports: [
//     PassportModule.register({
//       defaultStrategy: 'jwt',
//     }),
//     JwtModule.registerAsync({
//       useFactory: (configService: ConfigService) => ({
//         secret: configService.get('JWT_SECRET'),
//         signOptions: { expiresIn: '60s' },
//       }),
//       inject: [ConfigService],
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService, GoogleStrategy, LocalStrategy],
// })
// export class AuthModule {}
