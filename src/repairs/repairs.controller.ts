import {Controller} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';
import {RepairsService} from './repairs.service';
import {CreateRepairDto} from './dto/create-repair.dto';
import {UserInfo} from "../interfaces/userinfo.interface";

@Controller()
export class RepairsController {
  constructor(private readonly repairsService: RepairsService) {
  }

  @MessagePattern('createRepair')
  create(data: { createRepairDto: CreateRepairDto, user: UserInfo }) {
    return this.repairsService.create(data.createRepairDto, data.user);
  }

  // @MessagePattern('findAllRepairs')
  // findAll() {
  //   return this.repairsService.findAll();
  // }
  //
  // @MessagePattern('findOneRepair')
  // findOne(@Payload() id: number) {
  //   return this.repairsService.findOne(id);
  // }
  //
  // @MessagePattern('updateRepair')
  // update(@Payload() updateRepairDto: UpdateRepairDto) {
  //   return this.repairsService.update(updateRepairDto.id, updateRepairDto);
  // }
  //
  // @MessagePattern('removeRepair')
  // remove(@Payload() id: number) {
  //   return this.repairsService.remove(id);
  // }
}
