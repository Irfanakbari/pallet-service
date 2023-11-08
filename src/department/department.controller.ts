import {Controller} from '@nestjs/common';
import {MessagePattern, Payload} from '@nestjs/microservices';
import {DepartmentService} from './department.service';
import {CreateDepartmentDto} from './dto/create-department.dto';
import {UpdateDepartmentDto} from './dto/update-department.dto';

@Controller()
export class DepartmentController {
    constructor(private readonly departmentService: DepartmentService) {
    }

    @MessagePattern('createDepartment')
    create(createDepartmentDto: CreateDepartmentDto) {
        return this.departmentService.create(createDepartmentDto);
    }

    @MessagePattern('findAllDepartment')
    findAll() {
        return this.departmentService.findAll();
    }

    @MessagePattern('removeDepartment')
    remove(id: string) {
        return this.departmentService.remove(id);
    }

    @MessagePattern('updateDepartment')
    update(@Payload() updateDepartmentDto: UpdateDepartmentDto) {
        return this.departmentService.update(
            updateDepartmentDto.id,
            updateDepartmentDto,
        );
    }
}
