import {Module} from '@nestjs/common';
import {DepartmentService} from './department.service';
import {DepartmentController} from './department.controller';
import {SequelizeModule} from '@nestjs/sequelize';
import {DepartmentEntity} from './entities/department.entity';

@Module({
    imports: [SequelizeModule.forFeature([DepartmentEntity])],
    controllers: [DepartmentController],
    providers: [DepartmentService],
})
export class DepartmentModule {
}
