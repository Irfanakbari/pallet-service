import {BadRequestException, Injectable, InternalServerErrorException,} from '@nestjs/common';
import {CreatePalletDto} from './dto/create-pallet.dto';
import {PalletEntity} from './entities/pallet.entity';
import {RpcException} from '@nestjs/microservices';
import {Customer} from '../customer/entities/customer.entity';
import {VehicleEntity} from '../vehicle/entities/vehicle.entity';
import {PartEntity} from '../part/entities/part.entity';
import {Op} from 'sequelize';
import {InjectModel} from '@nestjs/sequelize';
import {DepartmentEntity} from '../department/entities/department.entity';

@Injectable()
export class PalletService {
    constructor(
        @InjectModel(PalletEntity)
        private palletRepo: typeof PalletEntity,
        @InjectModel(PartEntity)
        private partRepo: typeof PartEntity,
        @InjectModel(VehicleEntity)
        private vehicleRepo: typeof VehicleEntity,
    ) {
    }

    async create(createPalletDto: CreatePalletDto) {
        const {name, total, jenis, part} = createPalletDto;

        try {
            const parts = await this.partRepo.findOne({
                where: {
                    kode: part,
                },
                include: [
                    {
                        model: VehicleEntity,
                        include: [Customer],
                    },
                ],
            });
            // // Dapatkan data project berdasarkan kode_project
            //
            // if (!vehicles) {
            //   throw new BadRequestException('Kode Vehicle Tidak Ada');
            // }

            let pallets: PalletEntity[];
            let existingCodes = [];

            if (parts.vehicleEntity.department !== 'A') {
                pallets = await this.palletRepo.findAll({
                    where: {
                        kode: {
                            [Op.like]: `${jenis}-${parts.vehicleEntity.customer}${parts.vehicle}${part}%`,
                        },
                    },
                });
            } else {
                pallets = await this.palletRepo.findAll({
                    where: {
                        kode: {
                            [Op.like]: `${parts.vehicleEntity.customer}${parts.vehicle}${part}%`,
                        },
                    },
                });
            }

            // Mendapatkan semua kode yang sudah ada
            existingCodes = pallets.map((pallet) => pallet.kode);

            const palletsToCreate = [];
            let nextId = 1;

            for (let i = 0; i < total; i++) {
                // Mencari slot kosong dalam urutan kode
                while (
                    existingCodes.includes(
                        `${
                            parts.vehicleEntity.department !== 'A'
                                ? `${jenis}-${parts.vehicleEntity.customer}${parts.vehicle}${part}`
                                : `${parts.vehicleEntity.customer}${parts.vehicle}${part}`
                        }${nextId.toString().padStart(3, '0')}`,
                    )
                    ) {
                    nextId++;
                }

                const nextIdFormatted = nextId.toString().padStart(3, '0');
                const palletKode =
                    parts.vehicleEntity.department !== 'A'
                        ? `${jenis}-${parts.vehicleEntity.customer}${parts.vehicle}${part}${nextIdFormatted}`
                        : `${parts.vehicleEntity.customer}${parts.vehicle}${part}${nextIdFormatted}`;

                palletsToCreate.push({
                    kode: palletKode,
                    name,
                    part: part,
                });

                nextId++;
            }

            return this.palletRepo.bulkCreate(palletsToCreate);
        } catch (error) {
            throw new RpcException(error ?? new InternalServerErrorException());
        }
    }

    async findAll(data: any) {
        const {page = 1, limit = 30, customer, vehicle, part, search} = data;
        try {
            // Menghitung offset berdasarkan halaman dan batasan data
            const offset = (page - 1) * limit;
            let whereClause = {}; // Inisialisasi objek kosong untuk kondisi where

            if (customer) {
                whereClause = {
                    ...whereClause,
                    '$partEntity.vehicleEntity.customer$': customer,
                };
            }
            if (vehicle) {
                whereClause = {
                    ...whereClause,
                    '$partEntity.vehicleEntity.kode$': vehicle,
                };
            }
            if (part) {
                whereClause = {
                    ...whereClause,
                    '$partEntity.kode$': part,
                };
            }
            if (search) {
                whereClause = {
                    ...whereClause,
                    kode: {
                        [Op.like]: `%${search}%`,
                    },
                };
            }

            const pallets = await this.palletRepo.findAndCountAll({
                include: [
                    {
                        model: PartEntity,
                        include: [
                            {
                                model: VehicleEntity,
                                include: [Customer, DepartmentEntity],
                            },
                        ],
                    },
                ],
                where: whereClause,
                limit: parseInt(String(limit)),
                offset: parseInt(String(offset)),
            });
            return {
                data: pallets.rows,
                totalData: pallets.count,
                limit,
                currentPage: page,
            };
        } catch (e) {
            throw new RpcException(e ?? new InternalServerErrorException());
        }
    }

    async remove(id: string) {
        try {
            const result = await this.palletRepo.destroy({
                where: {
                    kode: id,
                },
            });
            if (result === 0) {
                throw new BadRequestException('Kode Pallet Tidak Ada');
            }
            return {
                message: 'Pallet Delete Success',
            };
        } catch (error) {
            throw new RpcException(error ?? new InternalServerErrorException());
        }
    }

    async removeBatch(data: string[]) {
        try {
            return this.palletRepo.destroy({
                where: {
                    kode: {
                        [Op.in]: data,
                    },
                },
            });
        } catch (error) {
            throw new RpcException(error ?? new InternalServerErrorException());
        }
    }
}
