import {Controller} from '@nestjs/common';
import {MessagePattern, Payload} from '@nestjs/microservices';
import {CustomerService} from './customer.service';
import {CreateCustomerDto} from './dto/create-customer.dto';
import {UpdateCustomerDto} from './dto/update-customer.dto';

@Controller()
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {
    }

    @MessagePattern('createCustomer')
    create(createCustomerDto: CreateCustomerDto) {
        return this.customerService.create(createCustomerDto);
    }

    @MessagePattern('findAllCustomer')
    findAll() {
        return this.customerService.findAll();
    }

    @MessagePattern('removeCustomer')
    remove(id: string) {
        return this.customerService.remove(id);
    }

    @MessagePattern('updateCustomer')
    update(@Payload() updateDepartmentDto: UpdateCustomerDto) {
        return this.customerService.update(
            updateDepartmentDto.id,
            updateDepartmentDto,
        );
    }
}
