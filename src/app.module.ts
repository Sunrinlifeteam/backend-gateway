import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelloModule } from './shared/modules/hello/hello.module';
import { UserModule } from './shared/modules/user/user.module';

@Module({
  imports: [
    HelloModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
