import {IsNotEmpty} from 'class-validator';

export class CreateCustomerDto {
    @IsNotEmpty()
    kode: string;

    @IsNotEmpty()
    name: string;
}
