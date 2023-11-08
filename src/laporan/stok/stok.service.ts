import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {PalletEntity} from '../../pallet/entities/pallet.entity';
import {PartEntity} from '../../part/entities/part.entity';
import {Op} from 'sequelize';
import {RpcException} from '@nestjs/microservices';
import {VehicleEntity} from '../../vehicle/entities/vehicle.entity';
import {User} from '../../interfaces/user.interface';
import {UserInfo} from '../../interfaces/userinfo.interface';

@Injectable()
export class StokService {
    constructor(
        @InjectModel(PalletEntity)
        private palletRepo: typeof PalletEntity,
        @InjectModel(PartEntity)
        private partRepo: typeof PartEntity,
    ) {
    }

    private filterRole = (user: User) => {
        return user.roles.find((r) => r.app === 'PALLET_CONTROL');
    };

    async findAll(user: UserInfo) {
        try {
            let stok: any[] = [];
            const whereClause = {
                [Op.and]: [], // Tambahkan kondisi pencarian jika diperlukan
            };
            const rolePallet = user.resource_access['pallet-control'].roles;
            if (rolePallet.find((r: string) => r === 'super')) {
                const parts = await this.partRepo.findAll({
                    where: {
                        ...whereClause,
                    },
                    // include: {
                    //   model: VehicleEntity,
                    //   attributes: ['department'],
                    // },
                });

                const stokPromises = parts.map(async (part) => {
                    const palletCounts: any = {};
                    palletCounts.total = await this.palletRepo.count({
                        where: {
                            ...whereClause,
                            part: part.kode,
                        },
                        // include: {
                        //   model: VehicleEntity,
                        //   attributes: ['department'],
                        // },
                    });

                    palletCounts.keluar = await this.palletRepo.count({
                        where: {
                            ...whereClause,
                            status: 0,
                            part: part.kode,
                        },
                        // include: {
                        //   model: VehicleEntity,
                        //   attributes: ['department'],
                        // },
                    });

                    palletCounts.maintenance = await this.palletRepo.count({
                        where: {
                            ...whereClause,
                            status: 3,
                            part: part.kode,
                        },
                        // include: {
                        //   model: PartEntity,
                        //   attributes: ['department'],
                        // },
                    });
                    palletCounts.tersedia = await this.palletRepo.count({
                        where: {
                            ...whereClause,
                            status: 1,
                            part: part.kode,
                        },
                        // include: {
                        //   model: PartEntity,
                        //   attributes: ['department'],
                        // },
                    });

                    return {
                        part: `${part.kode} - ${part.name}`,
                        tersedia: palletCounts.tersedia,
                        total: palletCounts.total,
                        keluar: palletCounts.keluar,
                        maintenance: palletCounts.maintenance,
                    };
                });

                stok = await Promise.all(stokPromises);
            } else if (
                rolePallet.find((r: string) => r === 'admin') ||
                rolePallet.find((r: string) => r === 'viewer')
            ) {
                const allowedDepartments = user.pallet_department;

                const parts = await this.partRepo.findAll({
                    include: {
                        model: VehicleEntity,
                        where: {
                            department: {
                                [Op.in]: allowedDepartments,
                            },
                        },
                    },
                });

                const stokPromises = parts.map(async (part) => {
                    const palletCounts: any = {};
                    palletCounts.total = await this.palletRepo.count({
                        where: {
                            ...whereClause,
                            part: part.get('kode'),
                        },
                        include: {
                            model: VehicleEntity,
                            attributes: ['department'],
                        },
                    });

                    palletCounts.keluar = await this.palletRepo.count({
                        where: {
                            ...whereClause,
                            status: 0,
                            part: part.get('kode'),
                        },
                        include: {
                            model: VehicleEntity,
                            attributes: ['department'],
                        },
                    });

                    palletCounts.maintenance = await this.palletRepo.count({
                        where: {
                            ...whereClause,
                            status: 3,
                            part: part.get('kode'),
                        },
                        include: {
                            model: VehicleEntity,
                            attributes: ['department'],
                        },
                    });

                    return {
                        part: `${part.kode} - ${part.name}`,
                        total: palletCounts.total,
                        keluar: palletCounts.keluar,
                        maintenance: palletCounts.maintenance,
                    };
                });

                stok = await Promise.all(stokPromises);
            }
            return stok;
        } catch (error) {
            throw new RpcException(error ?? new InternalServerErrorException());
        }
    }
}
