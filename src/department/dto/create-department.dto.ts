import {IsNotEmpty} from 'class-validator';

export class CreateDepartmentDto {
    @IsNotEmpty()
    kode: string;

    @IsNotEmpty()
    name: string;
}
