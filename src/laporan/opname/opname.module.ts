import {Module} from '@nestjs/common';
import {OpnameService} from './opname.service';
import {OpnameController} from './opname.controller';
import {SequelizeModule} from '@nestjs/sequelize';
import {StockopnameEntity} from '../../stockopname/entities/stockopname.entity';
import {StockopnameDetailEntity} from '../../stockopname/entities/stockopname-detail.entity';
import {PalletEntity} from '../../pallet/entities/pallet.entity';

@Module({
    imports: [
        SequelizeModule.forFeature([
            StockopnameEntity,
            StockopnameDetailEntity,
            PalletEntity,
        ]),
    ],
    controllers: [OpnameController],
    providers: [OpnameService],
})
export class OpnameModule {
}
