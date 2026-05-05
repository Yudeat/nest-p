import { Inject, Injectable,NotFoundException,NotImplementedException ,Logger} from '@nestjs/common';
import { createProfileDto, updateProfileDto } from './dto/create.profiles.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../typeOrm';
import type { Cache } from 'cache-manager';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
@Injectable()
export class ProfilesService {
  private readonly logger=new Logger(ProfilesService.name);
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository:Repository<Profile>,
    @Inject('CACHE_MANAGER') private readonly cacheManager:Cache,// Injecting the cache manager
    @InjectQueue('REMINDER_SERVICE') private readonly reminderQueue:Queue, // Injecting the reminder service
  ) {
   
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
  async findOne(id: number): Promise<Profile> {
    const cacheKey=`profile:${id}`; // Define a unique cache key for the profile
     const cacheProfile=await this.cacheManager.get<Profile>(cacheKey);
     if (cacheProfile){
       return cacheProfile; // Return the cached profile if it exists
     }

    try{
     const profile=await this.profileRepository.findOneByOrFail({id});

     await this.cacheManager.set(cacheKey,profile,0);

await this.reminderQueue.add(
        'send-reminder-job', // Job Name
        { profileId: id, email: profile.location }, // Job Data (Payload)
        { delay: 0, removeOnComplete: true } // Job Options
      );    
       return profile;

    }
      catch (error) {
        throw new NotFoundException(error.message);
      }
    

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

async update (id:number,dto:updateProfileDto){
  const profile=await this.profileRepository.findOneBy({id});
  if (!profile){
    throw new NotFoundException(`Profile with id ${id} not found`);
  }
  const updateProfile=this.profileRepository.merge(profile,dto);
  const saved = await this.profileRepository.save(updateProfile);
  await this.cacheManager.del(`profile:${id}`); // Invalidate the cache for the updated profile
  return saved;
}


async delete(id:number){
  const profile=await this.profileRepository.delete(id);
  if (profile.affected === 0){
    throw new NotFoundException(`Profile with id ${id} not found`);
  }
  await this.cacheManager.del(`profile:${id}`)
  return {message:`Profile with id ${id} deleted successfully`};}

}
    




