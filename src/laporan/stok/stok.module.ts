import {Module} from '@nestjs/common';
import {StokService} from './stok.service';
import {StokController} from './stok.controller';
import {SequelizeModule} from '@nestjs/sequelize';
import {PalletEntity} from '../../pallet/entities/pallet.entity';
import {PartEntity} from '../../part/entities/part.entity';
import {VehicleEntity} from '../../vehicle/entities/vehicle.entity';

@Module({
    imports: [
        SequelizeModule.forFeature([PalletEntity, PartEntity, VehicleEntity]),
    ],
    controllers: [StokController],
    providers: [StokService],
})
export class StokModule {
}
