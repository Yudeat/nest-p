import { Inject, Injectable,NotFoundException,NotImplementedException ,Logger} from '@nestjs/common';
import { createProfileDto, updateProfileDto } from './dto/create.profiles.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../typeOrm';
import type { Cache } from 'cache-manager';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class ProfilesService {
  private readonly logger=new Logger(ProfilesService.name);
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository:Repository<Profile>,
    @Inject('CACHE_MANAGER') private readonly cacheManager:Cache,// Injecting the cache manager
    @InjectQueue('REMINDER_SERVICE') private readonly reminderQueue:Queue, // Injecting the reminder service
    private readonly httpService:HttpService,
  ) {
   
  }
async enrichProfileWithExternalData(location:string){
  try{
    const {data}=await firstValueFrom(
      this.httpService.get(`https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${location}`)
    );
    return {
      ...data,
      weather:data.current.condition.text,
      temperature:data.current.temp_c,
    };
  }
  catch (error){
    this.logger.log(`Error fetching weather data for location ${location}: ${error.message}`);
    return null; // Return null if there was an error fetching the data
  }
}

async findAll() {
    return await this.profileRepository.find();
  }
  
  // async findOne(id: number) {
  //   const cacheKey=`profile:${id}`; // Define a unique cache key for the profile
  //   // Try to get the profile from the cache
  //   const cacheProfile=await this.cacheManager.get<Profile>(cacheKey);
  //   if (cacheProfile){
  //     return cacheProfile; // Return the cached profile if it exists
  //   }
    
  //   const profile=await this.profileRepository.findOneBy({id});
  //   if(!profile){
  //     throw new NotFoundException(`Profile with id ${id} not found`);
  //   }
  //   return profile;
  // }
  async findOne(id:number){
    const cacheKey=`profile:${id}`;// Define a unique cache key for the profile
    
    // Try to get the profile from the cache
    const cacheProfile=await this.cacheManager.get<Profile>(cacheKey);
    if (cacheProfile){
      return cacheProfile; // Return the cached profile if it exists
    }

  let profile:Profile;
  try {
profile=await this.profileRepository.findOneByOrFail({id});
  }
  catch (error){
    this.logger.log(`Error fetching profile with id ${id}: ${error.message}`);
    throw new NotFoundException(`Profile with id ${id} not found`);
  }
  // Store the profile in the cache with a TTL of 1 hour (3600000 milliseconds)
  try{
    await this.cacheManager.set(cacheKey,profile,3600000);

    await this.reminderQueue.add('profileAccessed',{
      profileId:id,
      name:profile.name,
      location:profile.location
    },
  {jobId:`profileAccessed:${id}`,delay:5000}
  );
  }
  catch (error){
    this.logger.log(`Error storing profile with id ${id} in cache: ${error.message}`);
  }
  return profile;
}
// async findOne(id: number) {
//   return await this.cacheManager.wrap(
//     `profile:${id}`, // Cache key
//     ()=>this.profileRepository.findOneByOrFail({id}),
//     360000 // Cache TTL (time to live) in milliseconds (e.g., 1 hour)
//   );
// }
async create (dto:createProfileDto){
  this.logger.log(`Creating profile with name: ${dto.name} and location: ${dto.location}`);
  try {
    const profile=this.profileRepository.create(dto);
    await this.profileRepository.save(profile);
    return profile;
  }catch (error)
{
  this.logger.log(`Error creating profile: ${error.message}`);
  throw new NotImplementedException(`Failed to create profile: ${error.message}`);
}  
}
async updateProfileAvatar(id:number,filePath:string){
  const profile=await this.profileRepository.findOneBy({id});
  if (!profile){
    throw new NotFoundException(`Profile with id ${id} not found`);
  }
  profile.avatar=filePath;
  const saved = await this.profileRepository.save(profile);
  await this.cacheManager.del(`profile:${id}`); // Invalidate the cache for the updated profile
  return saved;
}

async update(id:number,dto:updateProfileDto){
  const result=await this.profileRepository.update(id,dto);
  if (result.affected === 0){
    throw new NotFoundException(`Profile with id ${id} not found`);
  }
  await this.cacheManager.del(`profile:${id}`); // Invalidate the cache for the updated profile
  return result;
}


async delete(id:number){
  const profile=await this.profileRepository.delete(id);
  if (profile.affected === 0){
    throw new NotFoundException(`Profile with id ${id} not found`);
  }
  await this.cacheManager.del(`profile:${id}`)
  return {message:`Profile with id ${id} deleted successfully`};}

}
    




