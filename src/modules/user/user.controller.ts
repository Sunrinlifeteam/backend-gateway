import {
  Controller,
  Get,
  OnModuleInit,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { grpcClientOptions } from 'src/shared/options/user.grpc';
import { UserService } from 'src/shared/services/user.service';
import { User } from 'src/shared/transfer/user.dto';
import { AccessGuard } from '../auth/guards/access.guard';

@Controller('user')
export class UserController implements OnModuleInit {
  @Client(grpcClientOptions) private readonly client: ClientGrpc;
  private userService: UserService;

  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
  }

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  getUser(@Req() req: Request): Observable<User> {
    return this.userService.getUserById({
      value: req.user.id,
    });
  }

  @Get('/:id')
  getUserById(@Param('id') id: string): Observable<User> {
    return this.userService.getUserById({
      value: id,
    });
  }
}
