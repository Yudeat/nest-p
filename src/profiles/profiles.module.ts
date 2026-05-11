import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../typeOrm';
import { BullModule } from '@nestjs/bullmq';
import { ReminderProcessor } from 'src/queues/reminder.processor';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[
    TypeOrmModule.forFeature([Profile]),
    BullModule.registerQueue({
      name: 'REMINDER_SERVICE',
    }),
    HttpModule.register({
      timeout: 5000, // Set a timeout for HTTP requests (optional)
      maxRedirects: 5, // Set the maximum number of redirects (optional)
    })

],
  controllers: [ProfilesController],
  providers: [ProfilesService
,ReminderProcessor    
  ],
  exports: [ProfilesService],
})
export class ProfilesModule {}
