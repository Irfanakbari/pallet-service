import {Controller} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';
import {HistoryService} from './history.service';
import {CreateHistoryDto} from './dto/create-history.dto';
import {UpdateHistoryDto} from './dto/update-history.dto';

@Controller()
export class HistoryController {
    constructor(private readonly historyService: HistoryService) {
    }

    @MessagePattern('createHistory')
    create(createHistoryDto: CreateHistoryDto) {
        return this.historyService.create(createHistoryDto);
    }

    @MessagePattern('findAllHistory')
    findAll(data: any) {
        return this.historyService.findAll(data);
    }

    @MessagePattern('updateHistory')
    update(updateHistoryDto: UpdateHistoryDto) {
        return this.historyService.update(updateHistoryDto);
    }
}
