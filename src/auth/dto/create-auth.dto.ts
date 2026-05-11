import { IsString,  ValidateNested, IsObject, IsEnum, IsDate, IsUUID, IsEmail, IsUrl, IsNotEmpty, Length, Min, Max } from 'class-validator';

import { Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
export enum ResponseStatus {
  SUCCESS = 'success',
  FAIL = 'fail',
  ERROR = 'error',
}

export class DataDto {
  @ApiProperty({ 
    example: "Analysis of strategic risks...", 
    description: 'The core payload content' 
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 1000) 
  readonly content: string;
}

export class ApiResponseDto {
  @ApiProperty({ enum: ResponseStatus, example: ResponseStatus.SUCCESS })
  @IsEnum(ResponseStatus)
  readonly status: ResponseStatus;

  @ApiProperty({ example: "Operation completed successfully." })
  @IsString()
  @IsNotEmpty()
  readonly message: string;

  @ApiProperty({ type: DataDto })
  @ValidateNested()
  @Type(() => DataDto)
  @IsObject()
  readonly data: DataDto;
}