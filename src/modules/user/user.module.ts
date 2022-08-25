import { Module } from '@nestjs/common';
import { AccessStrategy } from '../auth/strategies/access.strategy';
import { UserController } from './user.controller';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [AccessStrategy],
})
export class UserModule {}
