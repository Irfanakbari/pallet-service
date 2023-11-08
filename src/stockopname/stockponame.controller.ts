import {Controller} from '@nestjs/common';
import {MessagePattern, Payload} from '@nestjs/microservices';
import {StockponameService} from './stockponame.service';
import {CreateStockopnameDto} from './dto/create-stockopname.dto';
import {UpdateStockopnameDto} from './dto/update-stockopname.dto';
import {UserInfo} from '../interfaces/userinfo.interface';

@Controller()
export class StockponameController {
    constructor(private readonly stockponameService: StockponameService) {
    }

    @MessagePattern('createStockOpname')
    create(
        @Payload()
            data: {
            createStockopnameDto: CreateStockopnameDto;
            user: UserInfo;
        },
    ) {
        return this.stockponameService.create(data);
    }

    @MessagePattern('findAllStockOpname')
    findAll() {
        return this.stockponameService.findAll();
    }

    @MessagePattern('removeStockOpname')
    remove(id: string) {
        return this.stockponameService.remove(id);
    }

    @MessagePattern('updateStockOpname')
    update(@Payload() data: { id: string; data: UpdateStockopnameDto }) {
        return this.stockponameService.update(data);
    }
}
