import {BadRequestException, Injectable, InternalServerErrorException,} from '@nestjs/common';
import {CreateStockopnameDto} from './dto/create-stockopname.dto';
import {StockopnameEntity} from './entities/stockopname.entity';
import {RpcException} from '@nestjs/microservices';
import {InjectModel} from '@nestjs/sequelize';
import {User} from '../interfaces/user.interface';
import * as randomstring from 'randomstring';
import {UpdateStockopnameDto} from './dto/update-stockopname.dto';
import {UserInfo} from '../interfaces/userinfo.interface';

@Injectable()
export class StockponameService {
    constructor(
        @InjectModel(StockopnameEntity)
        private stockopnameEntity: typeof StockopnameEntity,
    ) {
    }

    async create(data: {
        createStockopnameDto: CreateStockopnameDto;
        user: UserInfo;
    }) {
        const {catatan} = data.createStockopnameDto;

        try {
            const existingActiveSO = await this.stockopnameEntity.findOne({
                where: {
                    status: 1, // Status aktif
                },
            });

            // Buat StokOpname baru dengan status non-aktif
            const nanoid = randomstring.generate({
                length: 7,
                charset: 'alphanumeric',
            });
            // const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 7);
            const soKode = 'SO-' + `${nanoid.toUpperCase()}`;

            if (existingActiveSO) {
                return this.stockopnameEntity.create({
                    kode: soKode,
                    catatan: catatan,
                    created_by: data.user.preferred_username,
                    status: 0, // Status non-aktif
                });
            } else {
                return this.stockopnameEntity.create({
                    kode: soKode,
                    catatan: catatan,
                    created_by: data.user.preferred_username,
                    status: 1, // Status aktif
                });
            }
        } catch (e) {
            throw new RpcException(e ?? new InternalServerErrorException());
        }
    }

    private filterRole = (user: User) => {
        return user.roles.find((r) => r.app === 'PALLET_CONTROL');
    };

    findAll() {
        try {
            return this.stockopnameEntity.findAll();
        } catch (e) {
            throw new RpcException(e ?? new InternalServerErrorException());
        }
    }

    async remove(id: string) {
        try {
            const result = await this.stockopnameEntity.destroy({
                where: {
                    kode: id,
                },
            });
            if (result === 0) {
                throw new BadRequestException('Kode Vehicle Tidak Ada');
            }
            return {
                message: 'SO Delete Success',
            };
        } catch (error) {
            throw new RpcException(error ?? new InternalServerErrorException());
        }
    }

    async update(data: { id: string; data: UpdateStockopnameDto }) {
        try {
            // Cek apakah ada StokOpname aktif
            const activeStokOpname = await this.stockopnameEntity.findOne({
                where: {
                    status: 1,
                },
            });

            if (activeStokOpname && data.data.status === 1) {
                // Jika ada StokOpname aktif dan Anda mencoba membuat yang baru aktif, tolak pembaruan
                throw new BadRequestException(
                    'An active StokOpname already exists. You cannot create a new active one while another is active.',
                );
            }

            if (data.data.status === 1) {
                await this.stockopnameEntity.update(
                    {status: 0},
                    {
                        where: {
                            status: 1, // Hanya nonaktifkan yang aktif
                        },
                    },
                );
            }
            return await this.stockopnameEntity.update(
                {status: data.data.status},
                {
                    where: {
                        kode: data.id,
                    },
                },
            );
        } catch (e) {
            throw new RpcException(e ?? new InternalServerErrorException());
        }
    }
}
