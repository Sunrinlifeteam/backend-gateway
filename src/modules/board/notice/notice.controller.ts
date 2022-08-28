import {
  Body,
  Controller,
  Delete,
  Get,
  OnModuleInit,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { grpcClientOptions } from 'src/shared/options/board.grpc';
import { NoticeService } from 'src/shared/services/board.service';
import {
  GetNoticeListResponse,
  Notice,
  PartialNoticeForCreate,
  PartialNoticeForUpdate,
  SearchQuery,
} from 'src/shared/transfer/board.dto';

@Controller('board/notice')
export class NoticeController implements OnModuleInit {
  @Client(grpcClientOptions) private readonly client: ClientGrpc;
  private noticeService: NoticeService;

  onModuleInit() {
    this.noticeService = this.client.getService<NoticeService>('NoticeService');
  }

  @Get('/')
  getNoticeList(
    @Query() query: SearchQuery,
  ): Observable<GetNoticeListResponse> {
    query = Object.assign(new SearchQuery(), query);
    return this.noticeService.getNoticeList({
      search: query.search,
      page: query.page,
      pageSize: query.pageSize,
    });
  }

  @Get('/:id')
  getNotice(@Param('id') id: number): Observable<Notice> {
    return this.noticeService.getNotice({
      id,
    });
  }

  @Post('/')
  createNotice(@Body() notice: PartialNoticeForCreate): Observable<Notice> {
    return this.noticeService.createNotice(notice);
  }

  @Put('/:id')
  updateNotice(
    @Param('id') id: number,
    @Body() notice: PartialNoticeForUpdate,
    @Res() res: Response,
  ): void {
    this.noticeService
      .updateNotice({
        id,
        notice,
      })
      .subscribe({
        next: () => res.status(200).end(),
        error: (err) => res.status(500).send(err),
      });
  }

  @Delete('/:id')
  deleteNotice(@Param('id') id: number, @Res() res: Response): void {
    this.noticeService
      .deleteNotice({
        id,
      })
      .subscribe({
        next: () => res.status(200).end(),
        error: (err) => res.status(500).send(err),
      });
  }
}
