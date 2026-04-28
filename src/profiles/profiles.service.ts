import { Inject, Injectable,NotFoundException,NotImplementedException } from '@nestjs/common';
import { createProfileDto, updateProfileDto } from './dto/create.profiles.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../typeOrm';
import type { Cache } from 'cache-manager';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository:Repository<Profile>,
    @Inject('CACHE_MANAGER') private readonly cacheManager:Cache,// Injecting the cache manager

  ) {}

 
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
    try{
      // Try to get the profile from the cache
      return await this.cacheManager.wrap<Profile>(
        cacheKey,
        async ()=>{
          const profile=await this.profileRepository.findOneByOrFail({id})
          return profile;
        },
        360000 // Cache TTL (time to live) in milliseconds (e.g., 1 hour)
      );

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

  //data entry in database 
async create (dto:createProfileDto){
  const profile=this.profileRepository.create(dto);
  await this.profileRepository.save(profile);
  return profile;
}


async update (id:number,dto:updateProfileDto){
  const profile=await this.findOne(id)
const updateProfile=this.profileRepository.merge(profile,dto);
const saved = await this.profileRepository.save(updateProfile);
if (!saved){
  throw new NotFoundException(`Profile with id ${id} not found`);
  }
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
    




