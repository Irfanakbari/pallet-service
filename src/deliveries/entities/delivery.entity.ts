import {BelongsTo, Column, DataType, HasMany, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import {PartEntity} from '../../part/entities/part.entity';
import {PalletDeliveryEntity} from './pallet-delivery.entity';
import {PalletDeliveredEntity} from './pallet-delivered.entity';

@Table({
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'delivery',
})
export class DeliveryEntity extends Model<DeliveryEntity> {
    @PrimaryKey
    @Column({
        type: DataType.STRING,
    })
    id: string;

    @Column({
        type: DataType.STRING,
    })
    kode_delivery: string;

    @Column({
        type: DataType.INTEGER,
    })
    total_pallet: number;

    @Column({
        type: DataType.STRING,
    })
    tujuan: string;
    @Column({
        type: DataType.STRING,
    })
    sopir: string;
    @Column({
        type: DataType.STRING,
    })
    no_pol: string;

    @Column({
        type: DataType.DATEONLY,
    })
    tanggal_delivery: Date;

    @Column({
        type: DataType.STRING,
    })
    department: string;

    @Column({
        type: DataType.STRING,
    })
    part: string;

    @Column({
        type: DataType.BOOLEAN,
    })
    status: boolean;

    @BelongsTo(() => PartEntity, 'part') // 'department' adalah nama kolom yang digunakan untuk relasi
    partEntity: PartEntity;

    @HasMany(() => PalletDeliveryEntity, 'delivery_kode')
    palletDeliveryEntity: PalletDeliveryEntity;

    @HasMany(() => PalletDeliveredEntity, 'delivery_kode')
    palletDeliveredEntity: PalletDeliveredEntity;

    isCukup: boolean;
}
