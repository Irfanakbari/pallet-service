import {Controller} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';
import {DestinationService} from './destination.service';
import {CreateDestinationDto} from './dto/create-destination.dto';
import {UpdateDestinationDto} from './dto/update-destination.dto';

@Controller()
export class DestinationController {
    constructor(private readonly destinationService: DestinationService) {
    }

    @MessagePattern('createDestination')
    create(createCustomerDto: CreateDestinationDto) {
        return this.destinationService.create(createCustomerDto);
    }

    @MessagePattern('findAllDestination')
    findAll() {
        return this.destinationService.findAll();
    }

    @MessagePattern('removeDestination')
    remove(id: string) {
        return this.destinationService.remove(id);
    }

    @MessagePattern('updateDestination')
    update(data: { id: number; data: UpdateDestinationDto }) {
        return this.destinationService.update(data);
    }
}
