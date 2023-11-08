import {BadRequestException, ConflictException, Injectable, InternalServerErrorException,} from '@nestjs/common';
import {CreateDepartmentDto} from './dto/create-department.dto';
import {DepartmentEntity} from './entities/department.entity';
import {RpcException} from '@nestjs/microservices';
import {InjectModel} from '@nestjs/sequelize';
import {UpdateDepartmentDto} from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
    constructor(
        @InjectModel(DepartmentEntity)
        private departmentRepo: typeof DepartmentEntity,
    ) {
    }

    async create(createCustomerDto: CreateDepartmentDto) {
        const {kode, name} = createCustomerDto;

        try {
            const existingCustomer = await this.departmentRepo.findOne({
                where: {kode},
            });

            if (existingCustomer) {
                throw new ConflictException('Kode Department Sudah Ada');
            }

            return await this.departmentRepo.create({kode, name});
        } catch (error) {
            throw new RpcException(error ?? new InternalServerErrorException());
        }
    }

    findAll() {
        return this.departmentRepo.findAll();
    }

    async remove(id: string) {
        try {
            const result = await this.departmentRepo.destroy({
                where: {
                    kode: id,
                },
            });
            if (result === 0) {
                throw new BadRequestException('Kode Department Tidak Ada');
            }
            return {
                message: 'Department Delete Success',
            };
        } catch (error) {
            throw new RpcException(error ?? new InternalServerErrorException());
        }
    }

    update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
        return this.departmentRepo.update(updateDepartmentDto, {
            where: {
                kode: id,
            },
        });
    }
}
