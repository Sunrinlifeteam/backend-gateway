import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './shared/modules/auth/auth.module';
import { HelloModule } from './shared/modules/hello/hello.module';
import { UserModule } from './shared/modules/user/user.module';

@Module({
  imports: [
    HelloModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
