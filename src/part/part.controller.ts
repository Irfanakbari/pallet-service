import {Controller} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';
import {PartService} from './part.service';
import {CreatePartDto} from './dto/create-part.dto';

@Controller()
export class PartController {
    constructor(private readonly partService: PartService) {
    }

    @MessagePattern('createPart')
    create(createVehicleDto: CreatePartDto) {
        return this.partService.create(createVehicleDto);
    }

    @MessagePattern('findAllPart')
    findAll() {
        return this.partService.findAll();
    }

    @MessagePattern('removePart')
    remove(id: string) {
        return this.partService.remove(id);
    }
}
