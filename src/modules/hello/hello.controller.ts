import {
  Controller,
  Get,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Hello } from 'shared/lib/transfer/hello.dto';
import {
  HelloServiceClient,
  HELLO_PACKAGE_NAME,
  HELLO_SERVICE_NAME,
} from 'shared/lib/generated/hello';

@Injectable()
@Controller('hello')
export class HelloController implements OnModuleInit {
  private helloService: HelloServiceClient;

  constructor(
    @Inject(HELLO_PACKAGE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.helloService =
      this.client.getService<HelloServiceClient>(HELLO_SERVICE_NAME);
  }

  @Get('/')
  getHello(): Observable<Hello> {
    return this.helloService.getHello({});
  }
}
