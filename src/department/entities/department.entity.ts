import {Column, DataType, Model, PrimaryKey, Table,} from 'sequelize-typescript';

@Table({timestamps: false, tableName: 'department'})
export class DepartmentEntity extends Model<DepartmentEntity> {
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
}
