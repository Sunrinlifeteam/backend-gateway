import {
  Controller,
  OnModuleInit,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { grpcClientOptions } from 'src/shared/options/upload.grpc';
import { UploadService } from 'src/shared/services/upload.service';
import { FileResponse } from 'src/shared/transfer/upload.dto';

@Controller('upload')
export class UploadController implements OnModuleInit {
  @Client(grpcClientOptions) private readonly client: ClientGrpc;
  private userService: UploadService;

  onModuleInit() {
    this.userService = this.client.getService<UploadService>('UploadService');
  }

  @Post('/image')
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(
    @UploadedFile() imageFile: Express.Multer.File,
  ): string | Observable<FileResponse> {
    if (!imageFile) return 'File is not provided';
    return this.userService.uploadImage(imageFile);
  }
}
