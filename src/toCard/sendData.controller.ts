import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy, ClientTCP, MessagePattern } from '@nestjs/microservices';

@Controller()
export class SendDataController {
  constructor(@Inject('MATH_SERVICE') private readonly client: ClientProxy) {}

  private readonly logger = new Logger(SendDataController.name);
  @MessagePattern({ cmd: 'sesndData' })
  async connectRealCard(messageTo: string[]) {
    try {
      let commandArray = [''];

      for (let index = 0; index < messageTo.length; index++) {
        if (index > 3) {
          commandArray.push(messageTo[index]);
        }
      }
      commandArray.forEach(function (element) {
        element = element.replace(',', '');
        element = element.replace(' ', '');
      });

      await (async () => {
        const client = new ClientTCP({
          host: messageTo[2],
          port: Number(messageTo[3]),
        });

        await client.connect();
        console.log('send data')
        console.log(commandArray)
        setTimeout(async function () {
          //client.emit('', commandArray);
          console.log('başladıaa')
          const result = await client
            .send('', commandArray)
            .toPromise()
            .then((x) =>
              this.logger.verbose(
                'IPsi ' +
                  messageTo[2] +
                  ' olan cihazın komutu:' +
                  commandArray[0],
              ),
            )
            .catch((err) => {
              this.logger.error(
                'IPsi ' +
                  messageTo[2] +
                  ' olan cihaza bağlantı başarısız:' +
                  commandArray[0],
              );
            });
            console.log('bitti')
        }, 7500);

        console.log('bağlantı');
        this.logger.verbose('Incoming message: ' + messageTo);
        //console.log('Incoming Connect:' + message);
        return `You have connected  to this card: ${messageTo}`;
      })();

    
    } catch (error) {
      this.logger.error(
        'IPsi: ' + messageTo[2] + ' olan cihaza bağlantıda hata!',
      );
      //console.log('Incoming Connect:' + message);
      return `You have connected  to this card: ${messageTo}`;
    }
  }
}
