import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HELLO_PACKAGE_NAME } from 'shared/lib/generated/hello';
import { grpcClientOptions as grpcHelloOptions } from 'shared/lib/options/hello.grpc';
import { HelloController } from './hello.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: HELLO_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: grpcHelloOptions.options,
      },
    ]),
  ],
  controllers: [HelloController],
  providers: [],
})
export class HelloModule {}
