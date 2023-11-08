import {Module} from '@nestjs/common';
import {MaintenanceService} from './maintenance.service';
import {MaintenanceController} from './maintenance.controller';
import {SequelizeModule} from '@nestjs/sequelize';
import {PalletEntity} from '../../pallet/entities/pallet.entity';

@Module({
    imports: [SequelizeModule.forFeature([PalletEntity])],
    controllers: [MaintenanceController],
    providers: [MaintenanceService],
})
export class MaintenanceModule {
}
