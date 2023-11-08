import {PartialType} from '@nestjs/mapped-types';
import {CreateStockopnameDto} from './create-stockopname.dto';

export class UpdateStockopnameDto extends PartialType(CreateStockopnameDto) {
    status: number;
}
