import {BadRequestException, Injectable, InternalServerErrorException,} from '@nestjs/common';
import {CreateVehicleDto} from './dto/create-vehicle.dto';
import {VehicleEntity} from './entities/vehicle.entity';
import {RpcException} from '@nestjs/microservices';
import {DepartmentEntity} from '../department/entities/department.entity';
import {Customer} from '../customer/entities/customer.entity';
import {InjectModel} from '@nestjs/sequelize';
import {Op} from 'sequelize';
import {UserInfo} from '../interfaces/userinfo.interface';

@Injectable()
export class VehicleService {
    constructor(
        @InjectModel(VehicleEntity)
        private vehicleRepo: typeof VehicleEntity,
    ) {
    }

    async create(createVehicleDto: CreateVehicleDto) {
        const {name, department, customer} = createVehicleDto;

        try {
            const vehicles = await this.vehicleRepo.findAll({
                where: {kode: {[Op.like]: `${customer}%`}},
            });

            let nextId;
            if (vehicles.length > 0) {
                const vehicleNumbers = vehicles.map((palet) => {
                    const vehicleId = palet['kode'];
                    const numberString = vehicleId.slice(customer.length);
                    return parseInt(numberString);
                });

                for (let i = 1; i <= vehicles.length + 1; i++) {
                    if (!vehicleNumbers.includes(i)) {
                        nextId = i;
                        break;
                    }
                }

                // Jika tidak ada urutan kosong, gunakan urutan terakhir + 1
                if (!nextId) {
                    const lastNumber = Math.max(...vehicleNumbers);
                    nextId = lastNumber + 1;
                }
            } else {
                // Jika tidak ada valet sebelumnya, gunakan urutan awal yaitu 1
                nextId = 1;
            }

            const nextIdFormatted = nextId.toString();
            const vehicleCode = customer + nextIdFormatted;

            return this.vehicleRepo.create({
                kode: vehicleCode,
                name,
                department,
                customer,
            });
        } catch (error) {
            throw new RpcException(error ?? new InternalServerErrorException());
        }
    }

    findAll(user: UserInfo) {
        const rolePallet = user.resource_access['pallet-control'].roles;
        if (rolePallet.find((r: string) => r === 'super')) {
            return this.vehicleRepo.findAll({
                attributes: {
                    exclude: ['customer'],
                },
                include: [DepartmentEntity, Customer],
            });
        } else {
            return this.vehicleRepo.findAll({
                where: {
                    department: {[Op.in]: user.pallet_department},
                },
                attributes: {
                    exclude: ['customer'],
                },
                include: [DepartmentEntity, Customer],
            });
        }
    }

    async remove(id: string) {
        try {
            const result = await this.vehicleRepo.destroy({
                where: {
                    kode: id,
                },
            });
            if (result === 0) {
                throw new BadRequestException('Kode Vehicle Tidak Ada');
            }
            return {
                message: 'Vehicle Delete Success',
            };
        } catch (error) {
            throw new RpcException(error ?? new InternalServerErrorException());
        }
    }
}
