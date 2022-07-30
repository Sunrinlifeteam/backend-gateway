import {
  Controller,
  Get,
  OnModuleInit,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { grpcClientOptions } from 'src/shared/options/user.grpc';
import { UploadService } from 'src/shared/services/upload.service';
import { FileResponse } from 'src/shared/transfer/upload.dto';
import { User } from 'src/shared/transfer/user.dto';

@Controller('upload')
export class UploadController implements OnModuleInit {
  @Client(grpcClientOptions) private readonly client: ClientGrpc;
  private userService: UploadService;

  onModuleInit() {
    this.userService = this.client.getService<UploadService>('UserService');
  }

  @Get('/image')
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(
    @UploadedFile() imageFile: Express.Multer.File,
  ): Observable<FileResponse> {
    return this.userService.uploadImage(imageFile);
  }
}
