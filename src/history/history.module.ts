import {Module} from '@nestjs/common';
import {HistoryService} from './history.service';
import {HistoryController} from './history.controller';
import {SequelizeModule} from '@nestjs/sequelize';
import {HistoryEntity} from './entities/history.entity';
import {PalletEntity} from '../pallet/entities/pallet.entity';
import {HistoryopEntity} from '../historyop/entities/historyop.entity';
import {DeliveryEntity} from '../deliveries/entities/delivery.entity';
import {PalletDeliveryEntity} from '../deliveries/entities/pallet-delivery.entity';

@Module({
    imports: [
        SequelizeModule.forFeature([
            HistoryEntity,
            PalletEntity,
            HistoryopEntity,
            DeliveryEntity,
            PalletDeliveryEntity,
        ]),
    ],
    controllers: [HistoryController],
    providers: [HistoryService],
})
export class HistoryModule {
}
