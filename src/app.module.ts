import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelloModule } from './modules/hello/hello.module';
import { UploadModule } from './modules/upload/upload.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
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
