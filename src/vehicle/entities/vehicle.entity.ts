import {BelongsTo, Column, DataType, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import {DepartmentEntity} from '../../department/entities/department.entity';
import {Customer} from '../../customer/entities/customer.entity';

@Table({timestamps: false, tableName: 'vehicle'})
export class VehicleEntity extends Model<VehicleEntity> {
    @PrimaryKey
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    kode: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    customer: string;

    @BelongsTo(() => Customer, 'customer') // 'department' adalah nama kolom yang digunakan untuk relasi
    customerEntity: Customer;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    department: string;

    @BelongsTo(() => DepartmentEntity, 'department') // 'department' adalah nama kolom yang digunakan untuk relasi
    departmentEntity: DepartmentEntity;
}
