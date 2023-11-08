import {PartialType} from '@nestjs/mapped-types';
import {CreateOpnameDto} from './create-opname.dto';

export class UpdateOpnameDto extends PartialType(CreateOpnameDto) {
    id: number;
}
