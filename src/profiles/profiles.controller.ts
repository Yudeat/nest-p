import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ParseIntPipe,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  Version,
  UploadedFile,

} from '@nestjs/common';
import { IncomingFileValidator } from 'src/FileValidator/incomingFileValidator';
import { FileInterceptor } from '@nestjs/platform-express';

import { ProfilesService } from './profiles.service';
import { createProfileDto, updateProfileDto } from './dto/create.profiles.dto';
import { diskStorage } from 'multer';
// decorator @Controller() is used to define a controller in NestJS.
//  It takes an optional string parameter that specifies the route path for the controller. In this case, the controller will handle requests to the '/profiles' route.
@Controller('profiles')
@UseInterceptors(ClassSerializerInterceptor) // Apply the interceptor to the entire controller
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}
@Version('1')
  @Get()
  async findAll() {
    return await this.profilesService.findAll();
  }
  @Version('2')
  @Get()
 async findAll2() {
    return await this.profilesService.findAll();
  }


  @Get(':id')
 async findOne(@Param('id',ParseIntPipe) id: number) {
    // return this.profilesService.findOne(id);
    // throwError(() => new NotFoundException(`Profile with id ${id} not found`));
    // return this.profilesService.findOne(id);
    return await this.profilesService.findOne(id);
    // let service handle the error and throw it to the controller, the controllwe is for just direacting
    //  the request and response, the service is for handling the business logic and error handling, 
    // if there is an error in the service it will throw it to the controller and the controller will handle it and return the response to the client.
   


  }

  // @Post()
  // create(@Body(new ValidationPipe()) createProfileDto: createProfileDto){
  //   return this.profilesService.create(createProfileDto);
  // }
  @Post('file')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file',{
    storage:diskStorage({
      destination: './uploads',
    filename:(req ,file,cb)=>{
      const uniqueSuffix =Date.now()+'-'+Math.round(Math.random()*1e9);
      const originalName=file.originalname.replace(/\s/g,'-');
      const fileName=`${uniqueSuffix}-${originalName}`;
      cb(null,fileName);
    }
    })

    
  }))
  async uploadFile(@UploadedFile(
    new IncomingFileValidator()
  ) 
  file:Express.Multer.File){
    // Handle the uploaded file (e.g., save it to disk, process it, etc.)
    return {
      message: 'File uploaded successfully',
      file: file.originalname,
      filePath: file.path,
      fileSize: file.size,
    }
  }

  
@Put(':id')
async update(@Param('id',ParseIntPipe) id:number,@Body(new ValidationPipe()) updateProfileDto:updateProfileDto){
  try {
    return await this.profilesService.update(id,updateProfileDto);
    
  } catch (error) {
    throw new NotFoundException(error.message);
  }
}

@Delete(':id')
async delete(@Param('id',ParseIntPipe) id:number){
  try {
    return await this.profilesService.delete(id);
    
  } catch (error) {
    throw new NotFoundException(error.message);
  }
}
}
// @Controller('profiles') is a decorator that defines a controller for handling,
// requests to the '/profiles' route. This means that any HTTP requests made to '/profiles' will be handled by this controller.

// @Get() is a decorator that defines a route handler for HTTP GET requests. In this case, it will handle GET requests to the '/profiles' route.

// The findAll() method is the route handler for the GET request.
// It takes a query parameter named 'location' using the @Query() decorator.
// The method returns an array containing an object with the location value.
//  This means that when a GET request is made to '/profiles?location=someLocation', the
//  response will be an array with an object that includes the specified location.
