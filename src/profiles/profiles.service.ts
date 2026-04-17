import { Injectable } from '@nestjs/common';
import { createProfileDto, updateProfileDto } from './dto/create.profiles.dto';

@Injectable()
export class ProfilesService {
  private profiles = [
    { id: '1', name: 'Alice', desc: 'Software Engineer', location: 'London' },
    { id: '2', name: 'Bob', desc: 'Product Manager', location: 'New York' },
  ];
  findAll() {
    return this.profiles;
  }
  findOne(id: string) {
    return this.profiles.find((profile) => profile.id === id);
  }

  create(createProfileDto: createProfileDto) {
   const newProfile = {
    id: (this.profiles.length + 1).toString(),
    ...createProfileDto,
   }
   this.profiles.push(newProfile);
   return newProfile;
  }

  update(id:string, updateProfileDto:updateProfileDto){
    const profileUpdate = this.profiles.find(
        (profile)=>profile.id === id
    )
    if (!profileUpdate) {
        return {};
    }
    profileUpdate.name = updateProfileDto.name;
    profileUpdate.desc = updateProfileDto.desc;
    return profileUpdate;


  
}

delete(id:string){
    const index = this.profiles.findIndex((profile) => profile.id === id);
    if (index === -1) {
      return false; 
    }
    this.profiles.splice(index, 1);
    return true; 

}
}
