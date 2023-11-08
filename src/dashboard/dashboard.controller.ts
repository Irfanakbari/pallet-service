import {Controller} from '@nestjs/common';
import {MessagePattern, Payload} from '@nestjs/microservices';
import {DashboardService} from './dashboard.service';
import {UserInfo} from '../interfaces/userinfo.interface';

@Controller()
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {
    }

    @MessagePattern('findAllDashboard')
    findAll(@Payload() user: UserInfo) {
        return this.dashboardService.findAll(user);
    }

    @MessagePattern('findOneSlowmove')
    findOne(data: { id: string; user: UserInfo }) {
        return this.dashboardService.findOne(data);
    }
}
