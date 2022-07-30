import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { Empty } from 'google.protobuf';
import { Observable } from 'rxjs';
import { grpcClientOptions } from 'src/shared/options/hello.grpc';
import { Hello } from 'src/shared/transfer/hello.dto';

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
