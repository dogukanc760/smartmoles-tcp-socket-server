import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ToCardModule } from './toCard/toCard.module';

@Module({
  imports: [ToCardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
