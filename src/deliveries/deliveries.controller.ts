import {Controller} from '@nestjs/common';
import {MessagePattern, Payload} from '@nestjs/microservices';
import {DeliveriesService} from './deliveries.service';
import {CreateDeliveryDto} from './dto/create-delivery.dto';
import {UpdateDeliveryDto} from './dto/update-delivery.dto';
import {UserInfo} from '../interfaces/userinfo.interface';

@Controller()
export class DeliveriesController {
    constructor(private readonly deliveriesService: DeliveriesService) {
    }

    @MessagePattern('createDelivery')
    create(@Payload() createDeliveryDto: CreateDeliveryDto) {
        return this.deliveriesService.create(createDeliveryDto);
    }

    @MessagePattern('findAllDeliveries')
    findAll(user: UserInfo) {
        return this.deliveriesService.findAll(user);
    }

    @MessagePattern('findOneDelivery')
    findOne(@Payload() id: string) {
        return this.deliveriesService.findOne(id);
    }

    @MessagePattern('updateDelivery')
    update(@Payload() updateDeliveryDto: UpdateDeliveryDto) {
        return this.deliveriesService.update(
            updateDeliveryDto.id,
            updateDeliveryDto,
        );
    }

    @MessagePattern('removeDelivery')
    remove(@Payload() id: string) {
        return this.deliveriesService.remove(id);
    }
}
