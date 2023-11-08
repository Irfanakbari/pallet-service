import {BadRequestException, ConflictException, Injectable, InternalServerErrorException,} from '@nestjs/common';
import {CreateCustomerDto} from './dto/create-customer.dto';
import {Customer} from './entities/customer.entity';
import {RpcException} from '@nestjs/microservices';
import {InjectModel} from '@nestjs/sequelize';
import {UpdateCustomerDto} from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
    constructor(
        @InjectModel(Customer)
        private customerRepo: typeof Customer,
    ) {
    }

    async create(createCustomerDto: CreateCustomerDto) {
        const {kode, name} = createCustomerDto;

        try {
            const existingCustomer = await this.customerRepo.findOne({
                where: {kode},
            });

            if (existingCustomer) {
                throw new ConflictException('Kode Customer Sudah Ada');
            }

            return await this.customerRepo.create({kode, name});
        } catch (error) {
            throw new RpcException(error ?? new InternalServerErrorException());
        }
    }

    findAll() {
        return this.customerRepo.findAll();
    }

    async remove(id: string) {
        try {
            const result = await this.customerRepo.destroy({
                where: {
                    kode: id,
                },
            });
            if (result === 0) {
                throw new BadRequestException('Kode Customer Tidak Ada');
            }
            return {
                message: 'Customer Delete Success',
            };
        } catch (error) {
            throw new RpcException(error ?? new InternalServerErrorException());
        }
    }

    update(id: string, updateCustomerDto: UpdateCustomerDto) {
        return this.customerRepo.update(updateCustomerDto, {
            where: {
                kode: id,
            },
        });
    }
}
