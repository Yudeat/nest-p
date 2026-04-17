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
  Patch,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { createProfileDto, updateProfileDto } from './dto/create.profiles.dto';
// decorator @Controller() is used to define a controller in NestJS. It takes an optional string parameter that specifies the route path for the controller. In this case, the controller will handle requests to the '/profiles' route.
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(id);
  }

  @Post()
  create(@Body() createProfileDto: createProfileDto){
    return this.profilesService.create(createProfileDto);
  }

  

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: updateProfileDto) {
   return this.profilesService.update(id,updateProfileDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id') id: string) {
    const isDeleted = this.profilesService.delete(id);
    if (!isDeleted) {
      return { message: `Profile with id ${id} not found` };
    }
     return { message: `Profile with id ${id} deleted successfully` };
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
