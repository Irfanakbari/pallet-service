import {Module} from '@nestjs/common';
import {VehicleService} from './vehicle.service';
import {VehicleController} from './vehicle.controller';
import {SequelizeModule} from '@nestjs/sequelize';
import {VehicleEntity} from './entities/vehicle.entity';

@Module({
    imports: [SequelizeModule.forFeature([VehicleEntity])],
    controllers: [VehicleController],
    providers: [VehicleService],
})
export class VehicleModule {
}
