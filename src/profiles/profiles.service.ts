import { Injectable,NotFoundException,NotImplementedException } from '@nestjs/common';
import { createProfileDto, updateProfileDto } from './dto/create.profiles.dto';

@Injectable()
export class ProfilesService {
  private profiles = [
    { 
      id: '1', name: 'Alice', desc: 'Software Engineer', location: 'London' 
    },
    { id: '2', name: 'Bob', desc: 'Product Manager', location: 'New York' },
  ];
  findAll() {
    return this.profiles;
  }
  findOne(id: string) {
    // return this.profiles.find((profile) => profile.id === id);
    const machingProfile = this.profiles.find((profile)=>profile.id===id);
    if (!machingProfile){
      throw new Error(`Profile with id ${id} not found`);

    }
    return machingProfile;
  }

create(createProfileDto:createProfileDto){
  const newProfile={
    id:(this.profiles.length+1).toString(),
    ...createProfileDto,
  }
  this.profiles.push(newProfile);
  return newProfile;
}

  update(id:string, updateProfileDto:updateProfileDto){
    const matchingProfile=this.profiles.find((profile)=>profile.id===id)
   
    if (!matchingProfile){
      throw new NotImplementedException(`Profile with id ${id} not implemented yet`);
    
    }
matchingProfile.name=updateProfileDto.name;
matchingProfile.desc=updateProfileDto.desc;
matchingProfile.location=updateProfileDto.location;
return matchingProfile;


  
}

delete(id:string){
   const profileIndex=this.profiles.findIndex((profile)=>profile.id===id);
   if (profileIndex===-1){
   throw new NotFoundException(`Profile with id ${id} not found`);
  
   }
    this.profiles.splice(profileIndex,1);
    return true;

}
}
