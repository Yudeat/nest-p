import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ProfilesController } from './profiles/profiles.controller';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [ProfilesModule],
  controllers: [ProfilesController],
  providers: [AppService],
})
export class AppModule {}
