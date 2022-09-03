import {
  Body,
  Controller,
  Get,
  OnModuleInit,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { grpcClientOptions } from 'shared/lib/options/user.grpc';
import { UserService } from 'shared/lib/services/user.service';
import { UpdateUser, User } from 'shared/lib/transfer/user.dto';
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

  @Put('/')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  updateUser(@Req() req: Request, @Body() user: UpdateUser): Observable<User> {
    user.id = req.user.id;
    return this.userService.updateUser(user);
  }

  @Get('/:id')
  getUserById(@Param('id') id: string): Observable<User> {
    return this.userService.getUserById({
      value: id,
    });
  }
}
