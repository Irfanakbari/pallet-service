import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {CreateDeliveryDto} from './dto/create-delivery.dto';
import {UpdateDeliveryDto} from './dto/update-delivery.dto';
import {RpcException} from '@nestjs/microservices';
import {InjectModel} from '@nestjs/sequelize';
import {DeliveryEntity} from './entities/delivery.entity';
import * as randomstring from 'randomstring';
import {PartEntity} from '../part/entities/part.entity';
import {VehicleEntity} from '../vehicle/entities/vehicle.entity';
import {UserInfo} from '../interfaces/userinfo.interface';
import {Op} from 'sequelize';
import {PalletDeliveryEntity} from './entities/pallet-delivery.entity';
import {HistoryEntity} from '../history/entities/history.entity';
import {PalletDeliveredEntity} from './entities/pallet-delivered.entity';

@Injectable()
export class DeliveriesService {
    constructor(
        @InjectModel(DeliveryEntity)
        private deliveryRepo: typeof DeliveryEntity,
        @InjectModel(PalletDeliveryEntity)
        private palletDeliveryRepo: typeof PalletDeliveryEntity,
        @InjectModel(PartEntity)
        private partRepo: typeof PartEntity,
    ) {
    }

    async create(createDeliveryDto: CreateDeliveryDto) {
        try {
            const nanoid = randomstring.generate({
                length: 5,
                charset: 'alphanumeric',
            });
            const dlvId = 'DLV-' + `${nanoid.toUpperCase()}`;
            const part = await this.partRepo.findOne({
                where: {
                    kode: createDeliveryDto.part,
                },
                include: [VehicleEntity],
            });
            return this.deliveryRepo.create({
                ...createDeliveryDto,
                id: dlvId,
                department: part.vehicleEntity.department,
            });
        } catch (error) {
            throw new RpcException(error ?? new InternalServerErrorException());
        }
    }

    async findAll(user: UserInfo) {
        const rolePallet = user.resource_access['pallet-control'].roles;
        let deliveries = [];
        if (
            rolePallet.find((r: string) => r === 'super') ||
            rolePallet.find((r: string) => r === 'operator')
        ) {
            deliveries = await this.deliveryRepo.findAll({
                include: [
                    {
                        model: PartEntity,
                        include: [VehicleEntity],
                    },
                    {
                        model: PalletDeliveryEntity,
                        include: [HistoryEntity],
                    },
                ],
            });
            for (const delivery of deliveries) {
                delivery.dataValues.isCukup =
                    delivery['palletDeliveryEntity'].length === delivery.total_pallet;
            }
        } else {
            deliveries = await this.deliveryRepo.findAll({
                where: {
                    '$partEntity.vehicleEntity.department$': {
                        [Op.in]: user.pallet_department,
                    },
                },
                include: [
                    {
                        model: PartEntity,
                        include: [VehicleEntity],
                    },
                    {
                        model: PalletDeliveryEntity,
                        include: [HistoryEntity],
                    },
                ],
            });
            for (const delivery of deliveries) {
                delivery.dataValues.isCukup =
                    delivery['palletDeliveryEntity'].length === delivery.total_pallet;
            }
        }
        return deliveries;
    }

    async findOne(id: string) {
        try {
            const data = await this.deliveryRepo.findOne({
                where: {
                    id: id,
                },
                include: [
                    {
                        model: PalletDeliveryEntity,
                        include: [
                            {
                                model: HistoryEntity,
                                attributes: ['id_pallet', 'destination', 'keluar', 'user_out'],
                            },
                        ],
                    },
                    {
                        model: PalletDeliveredEntity,
                        include: [
                            {
                                model: PalletDeliveryEntity,
                                include: [
                                    {
                                        model: HistoryEntity,
                                        attributes: [
                                            'id_pallet',
                                            'destination',
                                            'keluar',
                                            'user_out',
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    PartEntity,
                ],
            });
            const temp = await this.palletDeliveryRepo.count({
                where: {
                    delivery_kode: data.id,
                },
            });
            data.isCukup = temp === data.total_pallet;
            return data;
        } catch (error) {
            throw new RpcException(error ?? new InternalServerErrorException());
        }
    }

    update(id: string, updateDeliveryDto: UpdateDeliveryDto) {
        return this.deliveryRepo.update(updateDeliveryDto, {
            where: {
                id: id,
            },
        });
    }

    remove(id: string) {
        return this.deliveryRepo.destroy({
            where: {
                id: id,
            },
        });
    }
}
