import {Controller} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';
import {PalletService} from './pallet.service';
import {CreatePalletDto} from './dto/create-pallet.dto';

@Controller()
export class PalletController {
    constructor(private readonly palletService: PalletService) {
    }

    @MessagePattern('createPallet')
    create(createPalletDto: CreatePalletDto) {
        return this.palletService.create(createPalletDto);
    }

    @MessagePattern('findAllPallet')
    findAll(data: any) {
        return this.palletService.findAll(data);
    }

    @MessagePattern('removePallet')
    remove(id: string) {
        return this.palletService.remove(id);
    }

    @MessagePattern('removePalletBatch')
    removeBatch(data: string[]) {
        return this.palletService.removeBatch(data);
    }
}
