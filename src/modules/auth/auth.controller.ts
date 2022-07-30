// import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { AuthGuard } from '@nestjs/passport';
// import { Request, Response } from 'express';
// import passport from 'passport';
// import { REFRESH_TOKEN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_OPTION } from 'src/shared/constants';
// import { AuthService } from './auth.service';

// @Controller('auth')
// export class AuthController {
//   constructor(
//     private readonly config: ConfigService,
//     private authService: AuthService,
//   ) {}

//   @Get('google')
//   @UseGuards(AuthGuard('google'))
//   async googleAuth(@Req() req) {
//     //
//   }

//   @Get('google/callback')
//   @UseGuards(AuthGuard('google'))
//   googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
//     const { isNewUser } = this.authService.googleLogin(req);
//     res.cookie(
//       REFRESH_TOKEN_COOKIE_KEY,
//       refreshToken,
//       REFRESH_TOKEN_COOKIE_OPTION,
//     );
//     return res.redirect(
//       this.config.get('FRONTEND_URL') + (isNewUser ? '/register' : ''),
//     );
//   }
// }
// // --------------------------------------------------------------------------------------------------------------------
// // End of generated code
// // --------------------------------------------------------------------------------------------------------------------
// // Language: typescript
// // Path: packages\gateway\src\shared\modules\auth\auth.module.ts
// // Compare this snippet from packages\gateway\src\shared\modules\auth\auth.module.ts:
// // import { Module } from '@nestjs/common';
// //
// // @Module({
// //   imports: [],
// //   controllers: [],
// //   providers: [],
// // })
// // export class AuthModule {}
// //
