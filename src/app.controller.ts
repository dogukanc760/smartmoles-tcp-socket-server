import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  @MessagePattern({ cmd: 'greeting' })
  getGreetingMessage(name: string): string {
    return `Dodo ${name}`;
  }

  @MessagePattern({ cmd: 'greeting-async' })
  async getGreetingMessageAysnc(name: string): Promise<string> {
    return `Hello ${name}`;
  }
}
