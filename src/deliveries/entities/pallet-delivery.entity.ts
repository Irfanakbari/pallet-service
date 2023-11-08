import {AutoIncrement, BelongsTo, Column, DataType, HasMany, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import {HistoryEntity} from '../../history/entities/history.entity';
import {DeliveryEntity} from './delivery.entity';
import {PalletDeliveredEntity} from './pallet-delivered.entity';

@Table({
    timestamps: false,
    tableName: 'pallet_delivery',
})
export class PalletDeliveryEntity extends Model<PalletDeliveryEntity> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
    })
    id: number;

    @Column({
        type: DataType.INTEGER,
    })
    history_kode: number;

    @Column({
        type: DataType.STRING,
    })
    delivery_kode: string;

    @BelongsTo(() => HistoryEntity, 'history_kode') // 'department' adalah nama kolom yang digunakan untuk relasi
    historyEntity: HistoryEntity;

    @BelongsTo(() => DeliveryEntity, 'delivery_kode') // 'department' adalah nama kolom yang digunakan untuk relasi
    deliveryEntity: DeliveryEntity;

    @HasMany(() => PalletDeliveredEntity, 'pallet_delivery')
    palletDeliveredEntity: PalletDeliveredEntity;
}
