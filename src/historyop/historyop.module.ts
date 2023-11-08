import {Module} from '@nestjs/common';
import {HistoryopService} from './historyop.service';
import {HistoryopController} from './historyop.controller';
import {SequelizeModule} from '@nestjs/sequelize';
import {HistoryopEntity} from './entities/historyop.entity';
import {PalletEntity} from '../pallet/entities/pallet.entity';

@Module({
    imports: [SequelizeModule.forFeature([HistoryopEntity, PalletEntity])],

    controllers: [HistoryopController],
    providers: [HistoryopService],
})
export class HistoryopModule {
}
