import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {CreateRepairDto} from './dto/create-repair.dto';
import {InjectModel} from "@nestjs/sequelize";
import {PalletEntity} from "../pallet/entities/pallet.entity";
import {RpcException} from "@nestjs/microservices";
import {Transactional} from "sequelize-transactional-decorator";
import {HistoryopEntity} from "../historyop/entities/historyop.entity";
import {UserInfo} from "../interfaces/userinfo.interface";

@Injectable()
export class RepairsService {
  constructor(
      @InjectModel(PalletEntity)
      private palletRepo: typeof PalletEntity,
      @InjectModel(HistoryopEntity)
      private historyopRepo: typeof HistoryopEntity,
  ) {
  }

  @Transactional()
  async create(createRepairDto: CreateRepairDto, user: UserInfo) {
    try {
      const pallet = await this.palletRepo.findOne({
        where: {
          kode: createRepairDto.kode_pallet
        }
      });

      if (pallet.status === 0) {
        throw new RpcException(new BadRequestException('Pallet Sedang Diluar'));
      }

      if (!pallet) {
        throw new RpcException(new BadRequestException('Pallet Tidak Ditemukan'));
      } else {
        let newStatus;
        if (pallet.status === 3) {
          newStatus = 1;
        } else {
          newStatus = 3;
        }

        await this.palletRepo.update({
          status: newStatus
        }, {
          where: {
            kode: createRepairDto.kode_pallet
          }
        });

        await this.historyopRepo.create({
          id_pallet: createRepairDto.kode_pallet,
          status: 'Maintenance',
          operator: user.preferred_username
        })
      }
      return "Sukses"
    } catch (e) {
      throw new RpcException(e ?? new InternalServerErrorException());
    }
  }
}
