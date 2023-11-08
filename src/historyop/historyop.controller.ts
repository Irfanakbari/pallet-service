import {Controller} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';
import {HistoryopService} from './historyop.service';
import {UserInfo} from '../interfaces/userinfo.interface';

@Controller()
export class HistoryopController {
    constructor(private readonly historyopService: HistoryopService) {
    }

    @MessagePattern('findAllHistoryOp')
    findAll(data: UserInfo) {
        return this.historyopService.findAll(data);
    }
}
