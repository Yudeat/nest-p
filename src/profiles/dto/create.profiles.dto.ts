import { IsString,Length } from 'class-validator';


export class createProfileDto {
  @IsString()
  @Length(3, 20)
  name: string;
  @IsString()
  desc: string;
  @IsString()
  location: string;
}

export class updateProfileDto {
  @IsString()
  @Length(3, 20)
  name: string;
  @IsString()
  desc: string;
  @IsString()
  location: string;
}


