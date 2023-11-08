import {Module} from '@nestjs/common';
import {DeliveriesService} from './deliveries.service';
import {DeliveriesController} from './deliveries.controller';
import {SequelizeModule} from '@nestjs/sequelize';
import {DeliveryEntity} from './entities/delivery.entity';
import {PartEntity} from '../part/entities/part.entity';
import {VehicleEntity} from '../vehicle/entities/vehicle.entity';
import {PalletDeliveryEntity} from './entities/pallet-delivery.entity';

@Module({
    imports: [
        SequelizeModule.forFeature([
            DeliveryEntity,
            PartEntity,
            VehicleEntity,
            PalletDeliveryEntity,
        ]),
    ],
    controllers: [DeliveriesController],
    providers: [DeliveriesService],
})
export class DeliveriesModule {
}
