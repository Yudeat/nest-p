import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ProfilesController } from './profiles/profiles.controller';
import { ProfilesModule } from './profiles/profiles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './typeOrm';

@Module({
  imports:[
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'aplle',
      password: '',
      database: 'postgres',
      retryAttempts: 1,
      entities:entities,
      
      // the sychronize option is used to automatically create database tables based on the entities defined in 
      // the application. When set to true, TypeORM will compare the current state of the database with the entities defined in 
      // the application and make necessary changes to synchronize them. This can include creating new tables,
      //  modifying existing tables, or dropping tables that are no longer needed.
      //  It is important to note that using synchronize: true in a production environment can lead to data loss if not used carefully, 
      // as it may drop existing tables or modify them in ways that could result in data loss. Therefore, it is recommended to use this 
      // option only during development or with caution in production environments.
      synchronize: true,
    }),
    ProfilesModule,
  ],
  controllers: [ProfilesController],
  providers: [AppService],
})
export class AppModule {}
