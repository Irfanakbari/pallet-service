import {BadRequestException, Injectable, InternalServerErrorException,} from '@nestjs/common';
import {CreateDestinationDto} from './dto/create-destination.dto';
import {DestinationEntity} from './entities/destination.entity';
import {RpcException} from '@nestjs/microservices';
import {InjectModel} from '@nestjs/sequelize';
import {UpdateDestinationDto} from './dto/update-destination.dto';
import {PartEntity} from '../part/entities/part.entity';
import {PalletEntity} from "../pallet/entities/pallet.entity";

@Injectable()
export class DestinationService {
    constructor(
        @InjectModel(DestinationEntity)
        private destinationRepo: typeof DestinationEntity,
        @InjectModel(PalletEntity)
        private palletRepo: typeof PalletEntity,
    ) {
    }

    async create(createDestinationDto: CreateDestinationDto) {
        const {part, name} = createDestinationDto;

        try {
            return this.destinationRepo.create({name, part});
        } catch (error) {
            throw new RpcException(error ?? new InternalServerErrorException());
        }
    }

    findAll() {
        return this.destinationRepo.findAll({
            include: [PartEntity],
        });
    }

    async remove(id: string) {
        try {
            const result = await this.destinationRepo.destroy({
                where: {
                    id: id,
                },
            });
            if (result === 0) {
                throw new BadRequestException('Kode Destinasi Tidak Ada');
            }
            return {
                message: 'Destination Delete Success',
            };
        } catch (error) {
            throw new RpcException(error ?? new InternalServerErrorException());
        }
    }

    async update(data: { id: number; data: UpdateDestinationDto }) {
        try {
            return this.destinationRepo.update(data.data, {
                where: {
                    id: data.id,
                },
            });
        } catch (error) {
            throw new RpcException(error ?? new InternalServerErrorException());
        }
    }

    async findOne(kode: string) {
        const pallet = await this.palletRepo.findByPk(kode)
        return this.destinationRepo.findAll({
            where: {
                part: pallet.part
            },
            include: [PartEntity],
        });
    }
}
