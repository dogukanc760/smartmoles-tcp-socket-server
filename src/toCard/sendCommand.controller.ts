import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy, ClientTCP, MessagePattern } from '@nestjs/microservices';

@Controller()
export class SendDataController {
  constructor(@Inject('SENDER_SERVICE') private readonly client: ClientProxy) {}

  private readonly logger = new Logger(SendDataController.name);
  @MessagePattern({ cmd: 'send-data' })
  async sendData(message: string[]) {
    try {
      const client = new ClientTCP({
        host: '188.38.15.80',
        port: 2000,
      });

      await client.connect();

      const pattern = { cmd: 'connect-card' };

      const sleep = (m) => new Promise((r) => setTimeout(r, m));
      console.log('Incoming data:' + message);
      await sleep(3200);
      console.log('Başladı');
      await client.emit(message, pattern);
      const result = await client
        .send('dodobey', pattern)
        .toPromise()
        .then((x) => console.log(x))
        .catch((err) => console.log(err));
      console.log('bitti');
      console.log(result);

      this.logger.verbose('Incoaming message: ' + message);
      //console.log('Incoming Connect:' + message);
      return `You have connected  to this card: ${message}`;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
