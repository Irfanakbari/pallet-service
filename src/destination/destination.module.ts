import {Module} from '@nestjs/common';
import {DestinationService} from './destination.service';
import {DestinationController} from './destination.controller';
import {SequelizeModule} from '@nestjs/sequelize';
import {DestinationEntity} from './entities/destination.entity';
import {PartEntity} from '../part/entities/part.entity';

@Module({
    imports: [SequelizeModule.forFeature([DestinationEntity, PartEntity])],
    controllers: [DestinationController],
    providers: [DestinationService],
})
export class DestinationModule {
}
