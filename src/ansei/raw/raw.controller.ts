import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {RawService} from './raw.service';
import {CreateRawDto} from './dto/create-raw.dto';
import {UpdateRawDto} from './dto/update-raw.dto';

@Controller('raw')
export class RawController {
    constructor(private readonly rawService: RawService) {
    }

    @Post()
    create(@Body() createRawDto: CreateRawDto) {
        return this.rawService.create(createRawDto);
    }

    @Get()
    findAll() {
        return this.rawService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.rawService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRawDto: UpdateRawDto) {
        return this.rawService.update(+id, updateRawDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.rawService.remove(+id);
    }
}
