import {BelongsTo, Column, DataType, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import {PartEntity} from '../../part/entities/part.entity';

@Table({createdAt: false, updatedAt: 'updated_at', tableName: 'pallets'})
export class PalletEntity extends Model<PalletEntity> {
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
    part: string;

    @BelongsTo(() => PartEntity, 'part')
    partEntity: PartEntity;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 1,
    })
    status: number;
}
