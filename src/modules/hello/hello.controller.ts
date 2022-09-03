import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { Empty } from 'google/protobuf/empty';
import { Observable } from 'rxjs';
import { grpcClientOptions } from 'shared/lib/options/hello.grpc';
import { Hello } from 'shared/lib/transfer/hello.dto';

interface HelloService {
  getHello(empty: Empty): Observable<Hello>;
}

@Controller('hello')
export class HelloController implements OnModuleInit {
  @Client(grpcClientOptions) private readonly client: ClientGrpc;
  private helloService: HelloService;

  onModuleInit() {
    this.helloService = this.client.getService<HelloService>('HelloService');
  }

  @Get('/')
  getHello(): Observable<Hello> {
    return this.helloService.getHello({});
  }
}
