import {Column, DataType, Model, PrimaryKey, Table,} from 'sequelize-typescript';

@Table({updatedAt: false, createdAt: 'tanggal_so', tableName: 'stock_opname'})
export class StockopnameEntity extends Model<StockopnameEntity> {
    @PrimaryKey
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    kode: string;

    @Column({
        type: DataType.DATE,
    })
    tanggal_so_closed: Date;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    catatan: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    created_by: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    status: number;

    @Column({
        type: DataType.DATE,
    })
    tanggal_so: any;
}
