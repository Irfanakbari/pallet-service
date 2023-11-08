import {Controller} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';
import {MaintenanceService} from './maintenance.service';
import {UserInfo} from '../../interfaces/userinfo.interface';

@Controller()
export class MaintenanceController {
    constructor(private readonly maintenanceService: MaintenanceService) {
    }

    @MessagePattern('findAllMaintenance')
    findAll(user: UserInfo) {
        return this.maintenanceService.findAll(user);
    }
}
