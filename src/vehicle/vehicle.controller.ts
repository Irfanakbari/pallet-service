import {Controller} from '@nestjs/common';
import {MessagePattern, Payload} from '@nestjs/microservices';
import {VehicleService} from './vehicle.service';
import {CreateVehicleDto} from './dto/create-vehicle.dto';
import {UserInfo} from '../interfaces/userinfo.interface';

@Controller()
export class VehicleController {
    constructor(private readonly vehicleService: VehicleService) {
    }

    @MessagePattern('createVehicle')
    create(createVehicleDto: CreateVehicleDto) {
        return this.vehicleService.create(createVehicleDto);
    }

    @MessagePattern('findAllVehicle')
    findAll(@Payload() user: UserInfo) {
        return this.vehicleService.findAll(user);
    }

    @MessagePattern('removeVehicle')
    remove(id: string) {
        return this.vehicleService.remove(id);
    }
}
