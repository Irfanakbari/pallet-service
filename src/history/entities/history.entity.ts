import {AutoIncrement, BelongsTo, Column, DataType, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import {PalletEntity} from '../../pallet/entities/pallet.entity';

@Table({createdAt: 'keluar', updatedAt: 'updated_at', tableName: 'history'})
export class HistoryEntity extends Model<HistoryEntity> {
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
    id_pallet: string;

    @BelongsTo(() => PalletEntity, 'id_pallet')
    palletEntity: PalletEntity;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    user_in: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    user_out: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    masuk: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    destination: string;

    @Column({
        type: DataType.DATE,
    })
    keluar: string;

    @Column({
        type: DataType.DATE,
    })
    updated_at: Date;
}
