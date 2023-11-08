import {Module} from '@nestjs/common';
import {DashboardService} from './dashboard.service';
import {DashboardController} from './dashboard.controller';
import {SequelizeModule} from '@nestjs/sequelize';
import {HistoryEntity} from '../history/entities/history.entity';
import {PalletEntity} from '../pallet/entities/pallet.entity';
import {Customer} from '../customer/entities/customer.entity';
import {PartEntity} from '../part/entities/part.entity';
import {VehicleEntity} from '../vehicle/entities/vehicle.entity';
import {DepartmentEntity} from '../department/entities/department.entity';
import {StockopnameEntity} from '../stockopname/entities/stockopname.entity';

@Module({
    imports: [
        SequelizeModule.forFeature([
            Customer,
            PalletEntity,
            HistoryEntity,
            PartEntity,
            VehicleEntity,
            DepartmentEntity,
            StockopnameEntity,
        ]),
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule {
}
