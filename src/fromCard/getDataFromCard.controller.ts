import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy, ClientTCP, MessagePattern } from '@nestjs/microservices';

@Controller()
export class SendDataController {
  constructor(@Inject('SENDER_SERVICE') private readonly client: ClientProxy) {}

  private readonly logger = new Logger(SendDataController.name);
  @MessagePattern({ cmd: 'get-data' })
  async getData(messageTo: string[]) {
    try {
      let commandArray = [''];

      await (async () => {
        const client = new ClientTCP({
          host: messageTo[2],
          port: Number(messageTo[3]),
        });
        for (let index = 0; index < messageTo.length; index++) {
          if (index > 3) {
            commandArray.push(messageTo[index]);
          }
        }
        await client.connect();

        const result = client.send('from-card', messageTo);

        if (!result) {
          return '';
        }

        this.logger.verbose('Incoming message: ' + messageTo);
        //console.log('Incoming Connect:' + message);
        return `${messageTo}`;
      })();
    } catch (error) {
      this.logger.error(
        'IPsi: ' + messageTo[2] + ' olan cihaz veri gönderirken hata!',
      );

      return `${messageTo}`;
    }
  }
}
