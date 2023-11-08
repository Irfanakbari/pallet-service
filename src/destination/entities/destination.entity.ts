import {AutoIncrement, BelongsTo, Column, DataType, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import {PartEntity} from '../../part/entities/part.entity';

@Table({timestamps: false, tableName: 'destinations'})
export class DestinationEntity extends Model<DestinationEntity> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    part: string;

    @BelongsTo(() => PartEntity, 'part') // 'department' adalah nama kolom yang digunakan untuk relasi
    partEntity: PartEntity;
}
