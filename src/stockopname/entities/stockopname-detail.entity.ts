import {BelongsTo, Column, DataType, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import {StockopnameEntity} from './stockopname.entity';
import {PalletEntity} from '../../pallet/entities/pallet.entity';

@Table({updatedAt: false, createdAt: 'scanned_at', tableName: 'detail_so'})
export class StockopnameDetailEntity extends Model<StockopnameDetailEntity> {
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    so_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    pallet_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    operator: string;

    @BelongsTo(() => StockopnameEntity, 'so_id')
    soEntity: StockopnameEntity;

    @BelongsTo(() => PalletEntity, 'pallet_id')
    palletEntity: PalletEntity;
}
