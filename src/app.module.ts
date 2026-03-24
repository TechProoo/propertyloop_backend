import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WaitlistModule } from './waitlist/waitlist.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, WaitlistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
