import { PartialType } from '@nestjs/mapped-types';
import { DataDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(DataDto) {}
