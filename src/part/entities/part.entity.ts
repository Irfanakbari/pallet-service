import {BelongsTo, Column, DataType, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import {VehicleEntity} from '../../vehicle/entities/vehicle.entity';

@Table({timestamps: false, tableName: 'parts'})
export class PartEntity extends Model<PartEntity> {
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
    vehicle: string;

    @BelongsTo(() => VehicleEntity, 'vehicle') // 'department' adalah nama kolom yang digunakan untuk relasi
    vehicleEntity: VehicleEntity;
}
