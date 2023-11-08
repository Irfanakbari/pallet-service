import {AutoIncrement, Column, DataType, Model, PrimaryKey, Table,} from 'sequelize-typescript';

@Table({
    createdAt: 'timestamp',
    updatedAt: false,
    tableName: 'temp_history_user',
})
export class HistoryopEntity extends Model<HistoryopEntity> {
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

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    status: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    operator: string;
}
