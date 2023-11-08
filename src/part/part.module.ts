import {Module} from '@nestjs/common';
import {PartService} from './part.service';
import {PartController} from './part.controller';
import {SequelizeModule} from '@nestjs/sequelize';
import {PartEntity} from './entities/part.entity';
import {VehicleEntity} from '../vehicle/entities/vehicle.entity';

@Module({
    imports: [SequelizeModule.forFeature([PartEntity, VehicleEntity])],
    controllers: [PartController],
    providers: [PartService],
})
export class PartModule {
}
