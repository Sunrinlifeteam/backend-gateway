import { Controller, Get, OnModuleInit, Param } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { grpcClientOptions } from 'src/shared/options/user.grpc';
import { UserService } from 'src/shared/services/user.service';
import { User } from 'src/shared/transfer/user.dto';

@Controller('user')
export class UserController implements OnModuleInit {
  @Client(grpcClientOptions) private readonly client: ClientGrpc;
  private userService: UserService;

  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
  }

  @Get('/:id')
  getUserById(@Param('id') id: string): Observable<User> {
    return this.userService.getUserById({
      value: id,
    });
  }
}
