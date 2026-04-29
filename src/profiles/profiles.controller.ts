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

} from '@nestjs/common';

import { ProfilesService } from './profiles.service';
import { createProfileDto, updateProfileDto } from './dto/create.profiles.dto';
// decorator @Controller() is used to define a controller in NestJS.
//  It takes an optional string parameter that specifies the route path for the controller. In this case, the controller will handle requests to the '/profiles' route.
@Controller('profiles')
@UseInterceptors(ClassSerializerInterceptor) // Apply the interceptor to the entire controller
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}
@Version('1')
  @Get()
  findAll() {
    return this.profilesService.findAll();
  }
  @Version('2')
  @Get()
  findAll2() {
    return this.profilesService.findAll();
  }


  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: number) {
    // return this.profilesService.findOne(id);
    // throwError(() => new NotFoundException(`Profile with id ${id} not found`));
    // return this.profilesService.findOne(id);
    try {
       return this.profilesService.findOne(id);
      
    } catch (error) {
      throw new NotFoundException(error.message);
    }
   


  }

  @Post()
  create(@Body(new ValidationPipe()) createProfileDto: createProfileDto){
    return this.profilesService.create(createProfileDto);
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
