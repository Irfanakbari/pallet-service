import {Module} from '@nestjs/common';
import {RepairsService} from './repairs.service';
import {RepairsController} from './repairs.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {PalletEntity} from "../pallet/entities/pallet.entity";
import {HistoryopEntity} from "../historyop/entities/historyop.entity";

@Module({
  imports: [SequelizeModule.forFeature([PalletEntity, HistoryopEntity])],
  controllers: [RepairsController],
  providers: [RepairsService],
})
export class RepairsModule {
}
