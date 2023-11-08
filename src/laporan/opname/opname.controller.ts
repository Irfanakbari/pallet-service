import {Controller} from '@nestjs/common';
import {MessagePattern, Payload} from '@nestjs/microservices';
import {OpnameService} from './opname.service';
import {CreateOpnameDto} from './dto/create-opname.dto';
import {UpdateOpnameDto} from './dto/update-opname.dto';

@Controller()
export class OpnameController {
    constructor(private readonly opnameService: OpnameService) {
    }

    @MessagePattern('createOpname')
    create(@Payload() createOpnameDto: CreateOpnameDto) {
        return this.opnameService.create(createOpnameDto);
    }

    @MessagePattern('findAllOpname')
    findAll() {
        return this.opnameService.findAll();
    }

    @MessagePattern('findOneOpname')
    findOne(@Payload() id: number) {
        return this.opnameService.findOne(id);
    }

    @MessagePattern('updateOpname')
    update(@Payload() updateOpnameDto: UpdateOpnameDto) {
        return this.opnameService.update(updateOpnameDto.id, updateOpnameDto);
    }

    @MessagePattern('removeOpname')
    remove(@Payload() id: number) {
        return this.opnameService.remove(id);
    }
}
