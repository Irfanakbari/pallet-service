import {BelongsTo, Column, DataType, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import {PalletDeliveryEntity} from './pallet-delivery.entity';
import {DeliveryEntity} from './delivery.entity';

@Table({
    createdAt: 'createdAt',
    updatedAt: false,
    tableName: 'pallet_delivered',
})
export class PalletDeliveredEntity extends Model<PalletDeliveredEntity> {
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
    })
    id: number;

    @Column({
        type: DataType.STRING,
    })
    delivery_kode: string;

    @Column({
        type: DataType.INTEGER,
    })
    pallet_delivery: number;

    @Column({
        type: DataType.STRING,
    })
    scannedBy: string;

    @BelongsTo(() => PalletDeliveryEntity, 'pallet_delivery')
    palletDeliveryEntity: PalletDeliveryEntity;

    @BelongsTo(() => DeliveryEntity, 'delivery_kode')
    deliveryEntity: DeliveryEntity;
}
