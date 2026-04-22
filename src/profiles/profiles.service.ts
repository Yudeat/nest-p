import { Injectable,NotFoundException,NotImplementedException } from '@nestjs/common';
import { createProfileDto, updateProfileDto } from './dto/create.profiles.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../typeOrm';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository:Repository<Profile>

  ) {}

 
  async findAll() {
    return await this.profileRepository.find();
  }
  async findOne(id) {
    // return this.profiles.find((profile) => profile.id === id);
    const machingProfile = await this.profileRepository.findBy({id})
    if (!machingProfile || machingProfile.length === 0){
      throw new Error(`Profile with id ${id} not found`);

    }
    return machingProfile[0];
  }

  //data entry in database 
async create(dto:createProfileDto){
 const profile=await this.profileRepository.create(dto);
 return this.profileRepository.save(profile);
};


async update(id: number, dto: updateProfileDto) {
    const profile = await this.findOne(id); 
    
    // Merges the new changes into the existing entity
    const updatedProfile = this.profileRepository.merge(profile, dto);
    return await this.profileRepository.save(updatedProfile);
  }


async delete(id:number){
  const profile=await this.profileRepository.delete(id);
  if (profile.affected === 0){
    throw new NotFoundException(`Profile with id ${id} not found`);
  }
  return {message:`Profile with id ${id} deleted successfully`};}

}
    




