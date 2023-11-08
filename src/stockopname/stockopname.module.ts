import {Module} from '@nestjs/common';
import {StockponameService} from './stockponame.service';
import {StockponameController} from './stockponame.controller';
import {SequelizeModule} from '@nestjs/sequelize';
import {StockopnameEntity} from './entities/stockopname.entity';

@Module({
    imports: [SequelizeModule.forFeature([StockopnameEntity])],
    controllers: [StockponameController],
    providers: [StockponameService],
})
export class StockopnameModule {
}
