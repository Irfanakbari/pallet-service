import {Column, DataType, Model, PrimaryKey, Table,} from 'sequelize-typescript';

@Table({timestamps: false, tableName: 'customer'})
export class Customer extends Model<Customer> {
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
}
