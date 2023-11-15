import {Module} from '@nestjs/common';
import {RawService} from './raw.service';
import {RawController} from './raw.controller';

@Module({
    controllers: [RawController],
    providers: [RawService],
})
export class RawModule {
}
