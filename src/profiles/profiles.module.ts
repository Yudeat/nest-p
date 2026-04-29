import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../typeOrm';
import { BullModule } from '@nestjs/bullmq';
import { ReminderProcessor } from 'src/queues/reminder.processor';

@Module({
  imports:[
    TypeOrmModule.forFeature([Profile]),
    BullModule.registerQueue({
      name: 'REMINDER_SERVICE',
    }),

],
  controllers: [ProfilesController],
  providers: [ProfilesService
,ReminderProcessor    
  ],
  exports: [ProfilesService],
})
export class ProfilesModule {}
