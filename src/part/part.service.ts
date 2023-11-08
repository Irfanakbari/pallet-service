import {BadRequestException, Injectable, InternalServerErrorException,} from '@nestjs/common';
import {CreatePartDto} from './dto/create-part.dto';
import {PartEntity} from './entities/part.entity';
import {RpcException} from '@nestjs/microservices';
import {Customer} from '../customer/entities/customer.entity';
import {VehicleEntity} from '../vehicle/entities/vehicle.entity';
import {InjectModel} from '@nestjs/sequelize';

@Injectable()
export class PartService {
    constructor(
        @InjectModel(PartEntity)
        private partRepo: typeof PartEntity,
        @InjectModel(VehicleEntity)
        private vehicleRepo: typeof VehicleEntity,
    ) {
    }

    async create(createPartDto: CreatePartDto) {
        const {kode, name, vehicle} = createPartDto;

        try {
            const vehic = await this.vehicleRepo.findByPk(vehicle);
            let code: string;
            if (vehic.department !== 'A') {
                code = vehic.customer + vehic.department + kode;
            } else {
                code = vehic.customer + kode;
            }
            return this.partRepo.create({name, kode: code, vehicle});
        } catch (error) {
            throw new RpcException(error ?? new InternalServerErrorException());
        }
    }

    findAll() {
        return this.partRepo.findAll({
            include: [
                {
                    model: VehicleEntity,
                    include: [Customer],
                },
            ],
        });
    }

    async remove(id: string) {
        try {
            const result = await this.partRepo.destroy({
                where: {
                    kode: id,
                },
            });
            if (result === 0) {
                throw new BadRequestException('Kode Part Tidak Ada');
            }
            return {
                message: 'Part Delete Success',
            };
        } catch (error) {
            throw new RpcException(error ?? new InternalServerErrorException());
        }
    }
}
