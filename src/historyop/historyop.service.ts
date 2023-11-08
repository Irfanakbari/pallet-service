import {Injectable} from '@nestjs/common';
import {HistoryopEntity} from './entities/historyop.entity';
import {InjectModel} from '@nestjs/sequelize';
import {UserInfo} from '../interfaces/userinfo.interface';
import {RpcException} from '@nestjs/microservices';

@Injectable()
export class HistoryopService {
    constructor(
        @InjectModel(HistoryopEntity)
        private historyopRepo: typeof HistoryopEntity,
    ) {
    }

    async findAll(user: UserInfo) {
        try {
            return this.historyopRepo.findAll({
                where: {
                    operator: user.preferred_username,
                },
            });
        } catch (err) {
            throw new RpcException('Internal Server Error');
        }
    }
}
