import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {PalletEntity} from '../../pallet/entities/pallet.entity';
import {PartEntity} from '../../part/entities/part.entity';
import {Op} from 'sequelize';
import {RpcException} from '@nestjs/microservices';
import {VehicleEntity} from '../../vehicle/entities/vehicle.entity';
import {User} from '../../interfaces/user.interface';
import {UserInfo} from '../../interfaces/userinfo.interface';
import {Customer} from "../../customer/entities/customer.entity";

@Injectable()
export class MaintenanceService {
    constructor(
        @InjectModel(PalletEntity)
        private palletRepo: typeof PalletEntity,
    ) {
    }

    private filterRole = (user: User) => {
        return user.roles.find((r) => r.app === 'PALLET_CONTROL');
    };

    async findAll(user: UserInfo) {
        try {
            let maintenance: any[] = [];
            const whereClause = {
                [Op.and]: [], // Tambahkan kondisi pencarian jika diperlukan
            };
            const rolePallet = user.resource_access['pallet-control'].roles;
            if (rolePallet.find((r: string) => r === 'super')) {
                maintenance = await this.palletRepo.findAll({
                    where: {
                        status: 3,
                        ...whereClause,
                    },
                    include: {
                        model: PartEntity,
                        include: [
                            {
                                model: VehicleEntity,
                                include: [Customer]
                            },
                        ],
                    },
                });
            } else if (
                rolePallet.find((r: string) => r === 'admin') ||
                rolePallet.find((r: string) => r === 'viewer')
            ) {
                const allowedDepartments = user.pallet_department;

                maintenance = await this.palletRepo.findAll({
                    where: {
                        status: 3,
                        '$partEntity.vehicleEntity.department$': {
                            [Op.in]: allowedDepartments,
                        },
                    },
                    include: {
                        model: PartEntity,
                        include: [
                            {
                                model: VehicleEntity,
                            },
                        ],
                    },
                });
            }
            return maintenance;
        } catch (error) {
            throw new RpcException(error ?? new InternalServerErrorException());
        }
    }
}
