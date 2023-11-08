import {BadRequestException, Injectable, InternalServerErrorException,} from '@nestjs/common';
import {CreateHistoryDto} from './dto/create-history.dto';
import {HistoryEntity} from './entities/history.entity';
import {RpcException} from '@nestjs/microservices';
import {PalletEntity} from '../pallet/entities/pallet.entity';
import {Transactional} from 'sequelize-transactional-decorator';
import {InjectModel} from '@nestjs/sequelize';
import {UpdateHistoryDto} from './dto/update-history.dto';
import {Op} from 'sequelize';
import {VehicleEntity} from '../vehicle/entities/vehicle.entity';
import {PartEntity} from '../part/entities/part.entity';
import {HistoryopEntity} from '../historyop/entities/historyop.entity';
import {UserInfo} from '../interfaces/userinfo.interface';
import {Customer} from '../customer/entities/customer.entity';
import {DeliveryEntity} from '../deliveries/entities/delivery.entity';
import {PalletDeliveryEntity} from '../deliveries/entities/pallet-delivery.entity';

@Injectable()
export class HistoryService {
    constructor(
        @InjectModel(HistoryEntity)
        private historyRepo: typeof HistoryEntity,
        @InjectModel(PalletEntity)
        private palletRepo: typeof PalletEntity,
        @InjectModel(HistoryopEntity)
        private historyopRepo: typeof HistoryopEntity,
        @InjectModel(DeliveryEntity)
        private deliveryEntity: typeof DeliveryEntity,
        @InjectModel(PalletDeliveryEntity)
        private palletDeliveryEntity: typeof PalletDeliveryEntity,
    ) {
    }

    @Transactional()
    async create(createHistoryDto: CreateHistoryDto) {
        const {kode, delivery_kode, operator} = createHistoryDto;

        try {
            const pallet = await this.palletRepo.findOne({
                where: {kode: kode},
            });
            if (pallet.status === 0) {
                throw new BadRequestException('Pallet Sedang Berada Diluar');
            }
            if (pallet.status === 3) {
                throw new BadRequestException('Pallet Sedang Dalam Status Maintenance');
            }
            const delivery = await this.deliveryEntity.findByPk(delivery_kode);

            await pallet.update({status: 0}, {where: {kode: kode}});
            // await TempHistory.create({
            //   id_pallet: kode,
            //   status: 'Keluar',
            //   operator: operator
            // });

            if (pallet.part !== delivery.part) {
                throw new BadRequestException(
                    'Part Pada Pallet Tidak Sama Dengan Part Delivery',
                );
            }

            const history = await this.historyRepo.create({
                id_pallet: kode,
                user_out: operator,
                destination: delivery.tujuan || null,
            });
            await this.historyopRepo.create({
                id_pallet: kode,
                status: 'Keluar',
                operator: operator,
            });

            return this.palletDeliveryEntity.create({
                history_kode: history.id,
                delivery_kode: delivery_kode,
            });
        } catch (error) {
            throw new RpcException(error ?? new InternalServerErrorException());
        }
    }

    async findAll(data: {
        query: {
            customer: string;
            vehicle: string;
            keluarStart: string;
            keluarEnd: string;
            masukStart: string;
            masukEnd: string;
            search: string;
            part: string;
            status: string;
            page: string;
            limit: string;
        };
        user: UserInfo;
    }) {
        const {
            customer,
            vehicle,
            keluarStart,
            keluarEnd,
            masukEnd,
            masukStart,
            search,
            part,
            status,
            limit,
            page,
        } = data.query;
        const rolePallet = data.user.resource_access['pallet-control'].roles;

        const offset = (parseInt(page || '1') - 1) * parseInt(limit || '30');
        let histories: any;
        let whereClause = {};

        if (customer && vehicle && part) {
            whereClause = {
                '$palletEntity.partEntity.vehicleEntity.customerEntity.kode$': customer,
                '$palletEntity.partEntity.vehicleEntity.kode$': vehicle,
                '$palletEntity.partEntity.kode$': part,
            };
        } else if (customer) {
            whereClause = {
                ...whereClause,
                '$palletEntity.partEntity.vehicleEntity.customerEntity.kode$': customer,
            };
        } else if (vehicle) {
            whereClause = {
                ...whereClause,
                '$palletEntity.partEntity.vehicleEntity.kode$': vehicle,
            };
        } else if (part) {
            whereClause = {
                ...whereClause,
                '$palletEntity.partEntity.kode$': part,
            };
        } else if (search) {
            whereClause = {
                // ...whereClause,
                id_pallet: {
                    [Op.substring]: search.toString(),
                },
            };
        }

        if (keluarStart && keluarEnd) {
            const startDate = new Date(keluarStart);
            startDate.setHours(0, 0, 0, 0); // Set start time to 00:00:00
            const endDate = new Date(keluarEnd);
            endDate.setHours(23, 59, 59, 999); // Set end time to 23:59:59.999

            whereClause = {
                ...whereClause,
                keluar: {
                    [Op.between]: [startDate.toISOString(), endDate.toISOString()],
                },
            };
        } else if (keluarStart) {
            const startDate = new Date(keluarStart);
            startDate.setHours(0, 0, 0, 0); // Set start time to 00:00:00

            whereClause = {
                ...whereClause,
                keluar: {
                    [Op.gte]: startDate.toISOString(),
                },
            };
        } else if (keluarEnd) {
            const endDate = new Date(keluarEnd);
            endDate.setHours(23, 59, 59, 999); // Set end time to 23:59:59.999

            whereClause = {
                ...whereClause,
                keluar: {
                    [Op.lte]: endDate.toISOString(),
                },
            };
        }
        if (masukStart && masukEnd) {
            const startDate = new Date(masukStart);
            startDate.setHours(0, 0, 0, 0); // Set start time to 00:00:00
            const endDate = new Date(masukEnd);
            endDate.setHours(23, 59, 59, 999); // Set end time to 23:59:59.999

            whereClause = {
                ...whereClause,
                masuk: {
                    [Op.between]: [startDate.toISOString(), endDate.toISOString()],
                },
            };
        } else if (masukStart) {
            const startDate = new Date(masukStart);
            startDate.setHours(0, 0, 0, 0); // Set start time to 00:00:00

            whereClause = {
                ...whereClause,
                masuk: {
                    [Op.gte]: startDate.toISOString(),
                },
            };
        } else if (masukEnd) {
            const endDate = new Date(masukEnd);
            endDate.setHours(23, 59, 59, 999); // Set end time to 23:59:59.999

            whereClause = {
                ...whereClause,
                masuk: {
                    [Op.lte]: endDate.toISOString(),
                },
            };
        }

        if (rolePallet.find((r: string) => r === 'super')) {
            // Jika user memiliki role 'super', tampilkan semua data Part tanpa batasan departemen
            histories = await this.historyRepo.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: PalletEntity,
                        where: status && {
                            $status$: status,
                        },
                        include: [
                            {
                                model: PartEntity,
                                include: [
                                    {
                                        model: VehicleEntity,
                                        include: [Customer],
                                    },
                                ],
                            },
                        ],
                    },
                ],
                limit: parseInt(limit || '30'),
                order: [['keluar', 'DESC']],
                offset: offset,
            });
        } else if (
            rolePallet.find((r: string) => r === 'admin') ||
            rolePallet.find((r: string) => r === 'viewer')
        ) {
            // Jika user memiliki role 'admin', tampilkan data Part dengan departemen yang sesuai

            histories = await this.historyRepo.findAndCountAll({
                where: {
                    ...whereClause,
                    '$palletEntity.partEntity.vehicleEntity.department$': {
                        [Op.in]: data.user.pallet_department,
                    },
                },
                include: [
                    {
                        model: PalletEntity,
                        where: status && {
                            $status$: status,
                        },
                        include: [
                            {
                                model: PartEntity,
                                include: [
                                    {
                                        model: VehicleEntity,
                                        include: [Customer],
                                    },
                                ],
                            },
                        ],
                    },
                ],
                limit: parseInt(limit || '30'),
                offset: offset,
            });
        }

        const totalData = histories.count;

        return {
            ok: true,
            data: histories.rows,
            totalData,
            limit: limit || 30,
            currentPage: parseInt(page || '1'),
        };
    }

    @Transactional()
    async update(data: UpdateHistoryDto) {
        const {kode, operator} = data;
        try {
            const pallet = await this.palletRepo.findOne({
                where: {kode: kode},
            });
            if (pallet.status === 1) {
                return new RpcException(new BadRequestException('Pallet Sudah Masuk'));
            }
            if (pallet.status === 3) {
                return new RpcException(
                    new BadRequestException('Pallet Sedang Dalam Status Maintenance'),
                );
            }
            const currentHistory = await this.historyRepo.findOne({
                where: {
                    id_pallet: kode,
                },
                order: [['keluar', 'DESC']],
            });

            await currentHistory.update({user_in: operator});
            await this.historyopRepo.create({
                id_pallet: kode,
                status: 'Masuk',
                operator: operator,
            });
            return this.palletRepo.update({status: 1}, {where: {kode: kode}});
        } catch (error) {
            throw new RpcException(error ?? new InternalServerErrorException());
        }
    }
}
