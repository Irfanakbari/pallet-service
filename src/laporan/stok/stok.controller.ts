import {Controller} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';
import {StokService} from './stok.service';
import {UserInfo} from '../../interfaces/userinfo.interface';

@Controller()
export class StokController {
    constructor(private readonly stokService: StokService) {
    }

    @MessagePattern('findAllStok')
    findAll(user: UserInfo) {
        return this.stokService.findAll(user);
    }
}
