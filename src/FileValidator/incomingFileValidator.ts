import { ArgumentMetadata, Injectable ,PipeTransform} from "@nestjs/common";


@Injectable()
export class IncomingFileValidator implements PipeTransform {
   private oneMb = 1024 * 1024; // 1MB in bytes

transform(value: any, metadata: ArgumentMetadata) {
    if(!value || !value.originalname || !value.size){
        throw new Error('Invalid file');
    }
    if(value.size > 5*this.oneMb){
        throw new Error('File size exceeds the limit of 1MB');
    }
    return value;
}
}