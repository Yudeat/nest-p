import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ProfilesController } from './profiles/profiles.controller';
import { ProfilesModule } from './profiles/profiles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from './auth/auth.module';

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
      retryDelay: 3000,
      // entities:entities,
      autoLoadEntities: true, // This option tells TypeORM to automatically load entities that are registered through the forFeature() method in the modules.

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
    // we need the cache module to cache the results of the getProfile method in the ProfilesService. 
    // This will help to improve the performance of the application by reducing the number of database queries.
    CacheModule.register(
      {
        isGlobal: true, // This option makes the cache module available globally in the application, so you don't need to import it in every module that needs caching.
      }
    ),
    // Bull module is a popular library for handling background jobs and message queues in Node.js applications. 
    // It provides a simple and efficient way to manage and process tasks asynchronously, allowing you to offload time-consuming operations from the main application thread. 
    // By using Bull, you can improve the performance and scalability of your application by processing tasks in the background without blocking the main execution flow.
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    // registering a queue named 'profileQueue' using the BullModule. 
    // This queue can be used to handle background tasks related to profiles,
    //  such as sending notifications, processing data, or performing any other 
    // asynchronous operations that are needed in the application.
    BullModule.registerQueue({
      name: 'profileQueue',
    }),
    AuthModule,
  ],
  controllers: [ProfilesController],
  providers: [AppService],
})
export class AppModule {}
