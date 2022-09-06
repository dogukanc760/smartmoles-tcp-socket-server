import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ClientProxy, ClientTCP, MessagePattern } from '@nestjs/microservices';
import { exec } from 'child_process';
import { Observable } from 'rxjs';
import { cli } from 'winston/lib/winston/config';
import * as net from 'net';

@Controller()
export class ToCardController {
  constructor(@Inject('MATH_SERVICE') private readonly client: ClientProxy) {}

  private readonly logger = new Logger(ToCardController.name);

  @Get()
  execute(): Observable<number> {
    const pattern = { cmd: 'sum' };
    const data = [1, 2, 3, 4, 5];
    return this.client.send<number>(pattern, data);
  }

  @MessagePattern({ cmd: 'send-to-card' })
  async getGreetingMessage(message: string): Promise<any> {
    try {
      const client = new net.Socket();
      const conn = client.connect(2000, '5.26.66.66');

      const pattern = { cmd: 'connect-card' };

      const sleep = (m) => new Promise((r) => setTimeout(r, m));

      this.logger.verbose(`Incoming data is: ${message}`);

      setTimeout(async () => {
        conn.write(message);
        console.log('Data Gönderimi baaşladı');
        console.log('data gönderimi bitti');
        conn.end();
        return `Your data is: ${message}`;
      }, 15000);
    } catch (error) {
      console.log(error);
      //exec('npm run start:dev');
      return error;
    }
  }

  //from card
  @MessagePattern({ cmd: '' })
  async connectRealCard(messageTo: string[]) {
    return `You have connected  to this card: ${messageTo}`;
  }
}
