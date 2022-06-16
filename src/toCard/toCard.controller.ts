import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ClientProxy, ClientTCP, MessagePattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';

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

  @MessagePattern({ cmd: 'connect-card' })
  getGreetingMessage(message: string): string {
    // (async () => {
    //   const client = new ClientTCP({
    //     host: '188.38.15.71',
    //     port: 2000,
    //   });

    //   await client.connect();

    //   const pattern = { cmd: 'connect-card' };
    //   const data = '[2, 3, 4, 5]';

    //   const result = await client
    //     .send(pattern, data)
    //     .toPromise()
    //     .then((x) => console.log(x))
    //     .catch((err) => console.log(err));
    // })();
    this.logger.verbose('Incoming message: ' + message);
    //console.log('Incoming Connect:' + message);
    return `You have connected  to this card: ${message}`;
  }
}
