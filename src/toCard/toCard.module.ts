import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SendDataController } from './sendData.controller';
import { ToCardController } from './toCard.controller';



@Module({
  imports: [
    ClientsModule.register([
      { name: 'MATH_SERVICE', transport: Transport.TCP },
    ]),
    ClientsModule.register([
      {
        name: 'GREETING_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '188.38.15.71',
          port: 2000,
        },
      },
    ]),
  ],
  controllers: [ToCardController, SendDataController],
})
export class ToCardModule {}
