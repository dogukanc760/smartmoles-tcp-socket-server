import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ClientProxy, ClientTCP, MessagePattern } from '@nestjs/microservices';
import { exec } from 'child_process';
import { Observable } from 'rxjs';
import { cli } from 'winston/lib/winston/config';
import * as net from 'net';
import { connect } from 'http2';

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

  public unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
    });
  }

  @MessagePattern({ cmd: 'send-to-card' })
  async getGreetingMessage(message: string): Promise<any> {
    try {
      const client = new net.Socket();
      const conn = client.connect(2000, '5.26.66.66');

      this.logger.verbose(`Incoming data is: ${message}`);
      var resCon = '';
      conn.on('data', (data) => {
        data.forEach((data) => {
          if (resCon === 'READY') {
            resCon = '';
          } else {
            this.logger.warn(`Else içi:${String.fromCharCode(data)}`);
          }
          resCon += String.fromCharCode(data);
        });
        this.getReadyMessage(resCon, conn, message)
          ? this.logger.verbose('Kart veri göndermeye hazır!')
          : this.logger.error('Kart veri göndermeye hazır değil!');
      });
      conn.on('error', (err: Error) => this.logger.error(`Veri göndermeye çalışırken bir hata oluştu=>${err}`));
    } catch (error) {
      console.log(error);
      //exec('npm run start:dev');
      return error;
    }
  }

  public getReadyMessage(
    resCon: string,
    server: net.Socket,
    message: any,
  ): boolean {
    if (resCon === 'READY') {
      this.logger.verbose(`Card is ready`);
      server.write(message);
      return true;
    }
    this.logger.verbose(`Last Rescon: ${resCon}`);
    this.logger.verbose(`Card is not ready`);
    return false;
  }
  //from card
  @MessagePattern({ cmd: '' })
  async connectRealCard(messageTo: string[]) {
    return `You have connected  to this card: ${messageTo}`;
  }
}
