import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { HelloModule } from './modules/hello/hello.module';
import { UploadModule } from './modules/upload/upload.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    AuthModule,
    HelloModule,
    UserModule,
    UploadModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
