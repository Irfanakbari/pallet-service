import {Module} from '@nestjs/common';
import {PalletService} from './pallet.service';
import {PalletController} from './pallet.controller';
import {SequelizeModule} from '@nestjs/sequelize';
import {PartEntity} from '../part/entities/part.entity';
import {VehicleEntity} from '../vehicle/entities/vehicle.entity';
import {PalletEntity} from './entities/pallet.entity';

@Module({
    imports: [
        SequelizeModule.forFeature([PalletEntity, PartEntity, VehicleEntity]),
    ],
    controllers: [PalletController],
    providers: [PalletService],
})
export class PalletModule {
}
