import {Injectable} from '@nestjs/common';
import {CreateRawDto} from './dto/create-raw.dto';
import {UpdateRawDto} from './dto/update-raw.dto';

@Injectable()
export class RawService {
    create(createRawDto: CreateRawDto) {
        return 'This action adds a new raw';
    }

    findAll() {
        return `This action returns all raw`;
    }

    findOne(id: number) {
        return `This action returns a #${id} raw`;
    }

    update(id: number, updateRawDto: UpdateRawDto) {
        return `This action updates a #${id} raw`;
    }

    remove(id: number) {
        return `This action removes a #${id} raw`;
    }
}
