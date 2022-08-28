import { Module } from '@nestjs/common';
import { NoticeController } from './notice.controller';

@Module({
  imports: [],
  controllers: [NoticeController],
  providers: [],
})
export class NoticeModule {}
