import {Injectable, InternalServerErrorException, Logger,} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {Customer} from '../customer/entities/customer.entity';
import {DepartmentEntity} from '../department/entities/department.entity';
import {PartEntity} from '../part/entities/part.entity';
import {VehicleEntity} from '../vehicle/entities/vehicle.entity';
import {HistoryEntity} from '../history/entities/history.entity';
import {PalletEntity} from '../pallet/entities/pallet.entity';
import {Op} from 'sequelize';
import * as moment from 'moment';
import {RpcException} from '@nestjs/microservices';
import {StockopnameEntity} from '../stockopname/entities/stockopname.entity';
import {UserInfo} from '../interfaces/userinfo.interface';

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(Customer)
        private customerRepo: typeof Customer,
        @InjectModel(DepartmentEntity)
        private departmentRepo: typeof DepartmentEntity,
        @InjectModel(PartEntity)
        private partRepo: typeof PartEntity,
        @InjectModel(VehicleEntity)
        private vehicleRepo: typeof VehicleEntity,
        @InjectModel(HistoryEntity)
        private historyRepo: typeof HistoryEntity,
        @InjectModel(PalletEntity)
        private palletRepo: typeof PalletEntity,
        @InjectModel(StockopnameEntity)
        private soRepo: typeof StockopnameEntity,
    ) {
    }

    async findAll(user: UserInfo) {
        const rolePallet = user.resource_access['pallet-control'].roles;
        try {
            let customers,
                departments,
                parts,
                historyPallet,
                totalPaletMendep,
                palletMendepRes,
                paletMendep,
                totalStokPallet,
                totalPallet,
                totalPalletRepair,
                totalPalletKeluar;
            if (rolePallet.find((r: string) => r === 'super')) {
                // Jika user memiliki role 'super', tampilkan semua data Customer tanpa batasan departemen
                customers = await this.customerRepo.findAll();
                departments = await this.departmentRepo.findAll();
                parts = await this.partRepo.findAll();
                historyPallet = await this.historyRepo.findAll({
                    limit: 5,
                    include: [PalletEntity],
                    order: [
                        ['updated_at', 'DESC'],
                        ['masuk', 'DESC'],
                    ],
                });
                const customerCounts = await Promise.all(
                    customers.map(async (c: Customer) => {
                        const histories = await this.historyRepo.findAll({
                            where: {
                                keluar: {
                                    [Op.lt]: moment().subtract(2, 'week').toDate(),
                                },
                                '$palletEntity.status$': 0,
                                masuk: null,
                                '$palletEntity.partEntity.vehicleEntity.customer$': c.kode,
                            },
                            include: [
                                {
                                    model: PalletEntity,
                                    include: [
                                        {
                                            model: PartEntity,
                                            include: [
                                                {
                                                    model: VehicleEntity,
                                                    include: [
                                                        {
                                                            model: Customer,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        });

                        const count = histories.length;

                        return {
                            customer: c.name,
                            total: count,
                        };
                    }),
                );

                palletMendepRes = customerCounts.filter((item) => item.total > 0);

                totalPaletMendep = await this.historyRepo.count({
                    where: {
                        keluar: {
                            [Op.lt]: moment().subtract(2, 'week').toDate(),
                        },
                        '$palletEntity.status$': 0,
                        masuk: null,
                    },
                    include: {
                        model: PalletEntity,
                    },
                });

                totalPallet = await this.palletRepo.count();

                totalStokPallet = await this.palletRepo.count({
                    where: {
                        status: 1,
                    },
                });

                totalPalletKeluar = await this.palletRepo.count({
                    where: {
                        status: 0,
                    },
                });

                totalPalletRepair = await this.palletRepo.count({
                    where: {
                        status: 3,
                    },
                });
            } else if (
                rolePallet.find((r: string) => r === 'admin') ||
                rolePallet.find((r: string) => r === 'viewer')
            ) {
                // Jika user memiliki role 'admin', tampilkan data Customer dengan departemen yang sesuai
                customers = await this.customerRepo.findAll();
                departments = await this.departmentRepo.findAll();
                parts = await this.partRepo.findAll({
                    where: {
                        '$vehicleEntity.department$': {[Op.in]: user.pallet_department},
                    },
                    include: [
                        {
                            model: VehicleEntity,
                            attributes: ['name', 'department'], // Memuat atribut department_id dari Customer
                        },
                    ],
                });

                historyPallet = await this.historyRepo.findAll({
                    where: {
                        '$palletEntity.partEntity.vehicleEntity.department$': {
                            [Op.in]: user.pallet_department,
                        },
                    },
                    limit: 5,
                    include: [
                        {
                            model: PalletEntity,
                            include: [
                                {
                                    model: PartEntity,
                                    include: [
                                        {
                                            model: VehicleEntity,
                                            attributes: ['name', 'department'], // Memuat atribut department_id dari Customer
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    // where: {
                    //   '$Pallet.Vehicle.department$': { [Op.in]: rolePallet.permissions },
                    // },
                    order: [
                        ['updated_at', 'DESC'],
                        ['masuk', 'DESC'],
                    ],
                });

                const customerCounts2 = await Promise.all(
                    customers.map(async (c: Customer) => {
                        const histories = await this.historyRepo.findAll({
                            where: {
                                keluar: {
                                    [Op.lt]: moment().subtract(2, 'week').toDate(),
                                },
                                '$palletEntity.status$': 0,
                                masuk: null,
                                '$palletEntity.partEntity.vehicleEntity.customer$': c.kode,
                                '$palletEntity.partEntity.vehicleEntity.department$': {
                                    [Op.in]: user.pallet_department,
                                }, // Filter berdasarkan department_id
                            },
                            include: [
                                {
                                    model: PalletEntity,
                                    include: [
                                        {
                                            model: PartEntity,
                                            include: [
                                                {
                                                    model: VehicleEntity,
                                                    include: [
                                                        {
                                                            model: Customer,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        });

                        const count = histories.length;

                        return {
                            customer: c.name,
                            total: count,
                        };
                    }),
                );

                palletMendepRes = customerCounts2.filter((item) => item.total > 0);

                totalPaletMendep = await this.historyRepo.count({
                    where: {
                        keluar: {
                            [Op.lt]: moment().subtract(2, 'week').toDate(),
                        },
                        masuk: null,
                        '$palletEntity.status$': 0,
                        '$palletEntity.partEntity.vehicleEntity.department$': {
                            [Op.in]: user.pallet_department,
                        },
                    },
                    include: [
                        {
                            model: PalletEntity,
                            include: [
                                {
                                    model: PartEntity,
                                    include: [
                                        {
                                            model: VehicleEntity,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                });

                totalPallet = await this.palletRepo.count({
                    where: {
                        '$partEntity.vehicleEntity.department$': {
                            [Op.in]: user.pallet_department,
                        },
                    },
                    include: [
                        {
                            model: PartEntity,
                            include: [
                                {
                                    model: VehicleEntity,
                                },
                            ],
                        },
                    ],
                });

                totalStokPallet = await this.palletRepo.count({
                    where: {
                        status: 1,
                        '$partEntity.vehicleEntity.department$': {
                            [Op.in]: user.pallet_department,
                        },
                    },
                    include: [
                        {
                            model: PartEntity,
                            include: [
                                {
                                    model: VehicleEntity,
                                },
                            ],
                        },
                    ],
                });

                totalPalletKeluar = await this.palletRepo.count({
                    where: {
                        status: 0,
                        '$partEntity.vehicleEntity.department$': {
                            [Op.in]: user.pallet_department,
                        },
                    },
                    include: [
                        {
                            model: PartEntity,
                            include: [
                                {
                                    model: VehicleEntity,
                                },
                            ],
                        },
                    ],
                });

                totalPalletRepair = await this.palletRepo.count({
                    where: {
                        status: 3,
                        '$partEntity.vehicleEntity.department$': {
                            [Op.in]: user.pallet_department,
                        },
                    },
                    include: [
                        {
                            model: PartEntity,
                            include: [
                                {
                                    model: VehicleEntity,
                                },
                            ],
                        },
                    ],
                });
            }

            const customerPromises = customers.map(async (customer: Customer) => {
                const palletCounts = {
                    keluar: 0,
                    total: 0,
                    maintenance: 0,
                    tersedia: 0,
                };

                if (rolePallet.find((r: string) => r === 'super')) {
                    // Jika user memiliki role 'super', tampilkan semua data Pallet tanpa batasan departemen
                    palletCounts['total'] = await this.palletRepo.count({
                        include: [
                            {
                                model: PartEntity,
                                include: [
                                    {
                                        model: VehicleEntity,
                                    },
                                ],
                            },
                        ],
                        where: {
                            '$partEntity.vehicleEntity.customer$': customer.kode,
                        },
                    });

                    palletCounts['keluar'] = await this.palletRepo.count({
                        where: {
                            status: 0,
                            '$partEntity.vehicleEntity.customer$': customer.kode,
                        },
                        include: [
                            {
                                model: PartEntity,
                                include: [
                                    {
                                        model: VehicleEntity,
                                    },
                                ],
                            },
                        ],
                    });

                    palletCounts['tersedia'] = await this.palletRepo.count({
                        where: {
                            status: 1,
                            '$partEntity.vehicleEntity.customer$': customer.kode,
                        },
                        include: [
                            {
                                model: PartEntity,
                                include: [
                                    {
                                        model: VehicleEntity,
                                    },
                                ],
                            },
                        ],
                    });

                    palletCounts['maintenance'] = await this.palletRepo.count({
                        where: {
                            status: 3,
                            '$partEntity.vehicleEntity.customer$': customer.kode,
                        },
                        include: [
                            {
                                model: PartEntity,
                                include: [
                                    {
                                        model: VehicleEntity,
                                    },
                                ],
                            },
                        ],
                    });
                } else if (
                    rolePallet.find((r: string) => r === 'admin') ||
                    rolePallet.find((r: string) => r === 'viewer')
                ) {
                    // Jika user memiliki role 'admin', tampilkan data Pallet dengan departemen yang sesuai
                    palletCounts['total'] = await this.palletRepo.count({
                        include: [
                            {
                                model: PartEntity,
                                include: [
                                    {
                                        model: VehicleEntity,
                                    },
                                ],
                            },
                        ],
                        where: {
                            '$partEntity.vehicleEntity.customer$': customer.kode,
                            '$partEntity.vehicleEntity.department$': {
                                [Op.in]: user.pallet_department,
                            },
                        },
                    });

                    palletCounts['keluar'] = await this.palletRepo.count({
                        include: [
                            {
                                model: PartEntity,
                                include: [
                                    {
                                        model: VehicleEntity,
                                    },
                                ],
                            },
                        ],
                        where: {
                            status: 0,
                            '$partEntity.vehicleEntity.customer$': customer.kode,
                            '$partEntity.vehicleEntity.department$': {
                                [Op.in]: user.pallet_department,
                            },
                        },
                    });

                    palletCounts['tersedia'] = await this.palletRepo.count({
                        include: [
                            {
                                model: PartEntity,
                                include: [
                                    {
                                        model: VehicleEntity,
                                    },
                                ],
                            },
                        ],
                        where: {
                            status: 1,
                            '$partEntity.vehicleEntity.customer$': customer.kode,
                            '$partEntity.vehicleEntity.department$': {
                                [Op.in]: user.pallet_department,
                            },
                        },
                    });

                    palletCounts['maintenance'] = await this.palletRepo.count({
                        include: [
                            {
                                model: PartEntity,
                                include: [
                                    {
                                        model: VehicleEntity,
                                    },
                                ],
                            },
                        ],
                        where: {
                            status: 3,
                            '$partEntity.vehicleEntity.customer$': customer.kode,
                            '$partEntity.vehicleEntity.department$': {
                                [Op.in]: user.pallet_department,
                            },
                        },
                    });
                }
                return {
                    customer: customer.name,
                    Total: palletCounts.total,
                    Tersedia: palletCounts.tersedia,
                    Keluar: palletCounts.keluar,
                    Maintenance: palletCounts.maintenance,
                };
            });

            const customerPallets = await Promise.all(customerPromises);

            const statData = await Promise.all(
                customerPallets.map((customerPromise: any) => {
                    const {customer, Tersedia, Keluar, Maintenance} = customerPromise;

                    return [
                        {
                            label: customer,
                            type: 'Keluar',
                            value: Keluar,
                        },
                        {
                            label: customer,
                            type: 'Maintenance',
                            value: Maintenance,
                        },
                        {
                            label: customer,
                            type: 'Tersedia',
                            value: Tersedia,
                        },
                    ];
                }),
            ).then((arrays) => arrays.flat());

            // Now, statData is the flattened array of objects without any nested arrays.

            const departmentPromises = departments.map(
                async (department: DepartmentEntity) => {
                    const palletCounts = {
                        keluar: 0,
                        total: 0,
                        maintenance: 0,
                    };
                    palletCounts['total'] = await this.palletRepo.count({
                        include: [
                            {
                                model: PartEntity,
                                include: [
                                    {
                                        model: VehicleEntity,
                                    },
                                ],
                            },
                        ],
                        where: {
                            '$partEntity.vehicleEntity.department$': department.kode,
                        },
                    });
                    palletCounts['keluar'] = await this.palletRepo.count({
                        include: [
                            {
                                model: PartEntity,
                                include: [
                                    {
                                        model: VehicleEntity,
                                    },
                                ],
                            },
                        ],
                        where: {
                            status: 0,
                            '$partEntity.vehicleEntity.department$': department.kode,
                        },
                    });
                    palletCounts['maintenance'] = await this.palletRepo.count({
                        where: {
                            status: 3,
                            '$partEntity.vehicleEntity.department$': department.kode,
                        },
                        include: [
                            {
                                model: PartEntity,
                                include: [
                                    {
                                        model: VehicleEntity,
                                        // where: {
                                        //   department: department.kode,
                                        // },
                                    },
                                ],
                            },
                        ],
                    });
                    return {
                        department: 'Prod. ' + department.kode,
                        Total: palletCounts.total,
                        Keluar: palletCounts.keluar,
                        Maintenance: palletCounts.maintenance,
                    };
                },
            );

            const partPromises = parts.map(async (part: PartEntity) => {
                const palletCounts = {
                    keluar: 0,
                    total: 0,
                    maintenance: 0,
                };
                palletCounts['total'] = await this.palletRepo.count({
                    include: [
                        {
                            model: PartEntity,
                            where: {
                                kode: part.kode,
                            },
                        },
                    ],
                });
                palletCounts['keluar'] = await this.palletRepo.count({
                    where: {
                        status: 0,
                    },
                    include: [
                        {
                            model: PartEntity,
                            where: {
                                kode: part.kode,
                            },
                        },
                    ],
                });
                palletCounts['maintenance'] = await this.palletRepo.count({
                    where: {
                        status: 3,
                    },
                    include: [
                        {
                            model: PartEntity,
                            where: {
                                kode: part.kode,
                            },
                        },
                    ],
                });
                return {
                    part: `${part.kode} - ${part.name}`,
                    Total: palletCounts.total,
                    Keluar: palletCounts.keluar,
                    Maintenance: palletCounts.maintenance,
                };
            });

            const partPallet = await Promise.all(partPromises);

            const statData2 = await Promise.all(
                partPallet.map(async (partPromise: any) => {
                    const {part, Total, Keluar, Maintenance} = partPromise;

                    return [
                        {
                            label: part,
                            type: 'Keluar',
                            value: Keluar,
                        },
                        {
                            label: part,
                            type: 'Maintenance',
                            value: Maintenance,
                        },
                        {
                            label: part,
                            type: 'Tersedia',
                            value: Total,
                        },
                    ];
                }),
            ).then((arrays) => arrays.flat());

            const isSo = await this.soRepo.count({
                where: {
                    status: 1,
                },
            });

            if (rolePallet.find((r: string) => r === 'super')) {
                const customerPallets = await Promise.all(statData);
                const departmentPallets = await Promise.all(departmentPromises);
                const partPallets = await Promise.all(statData2);
                return {
                    data: {
                        stokDepartment: departmentPallets,
                        stokPart: partPallets,
                        chartStok: customerPallets,
                        totalPallet,
                        totalStokPallet,
                        totalPalletKeluar,
                        totalPalletRepair,
                        historyPallet,
                        totalPaletMendep,
                        paletMendep: palletMendepRes,
                        isSo: isSo > 0,
                    },
                };
            } else {
                const customerPallets = await Promise.all(statData);
                const partPallets = await Promise.all(statData2);
                return {
                    data: {
                        stokPart: partPallets,
                        chartStok: customerPallets,
                        totalPallet,
                        totalStokPallet,
                        totalPalletKeluar,
                        totalPalletRepair,
                        historyPallet,
                        totalPaletMendep,
                        paletMendep: palletMendepRes,
                        isSo: isSo > 0,
                    },
                };
            }
        } catch (e) {
            throw new RpcException(e ?? new InternalServerErrorException());
        }
    }

    async findOne(data: { id: string; user: UserInfo }) {
        const rolePallet = data.user.resource_access['pallet-control'].roles;
        let datas: any[];
        try {
            if (rolePallet.find((r: string) => r === 'super')) {
                datas = await this.historyRepo.findAll({
                    where: {
                        keluar: {
                            [Op.lt]: moment().subtract(2, 'week').toDate(),
                        },
                        masuk: null,
                        '$palletEntity.status$': 0,
                        '$palletEntity.partEntity.vehicleEntity.customerEntity.name$':
                        data.id,
                    },
                    // attributes: ['id_pallet', 'destination', 'palletEntity'],
                    include: [
                        {
                            model: PalletEntity,
                            include: [
                                {
                                    model: PartEntity,
                                    include: [
                                        {
                                            model: VehicleEntity,
                                            include: [
                                                {
                                                    model: Customer,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                });
            } else {
                datas = await this.historyRepo.findAll({
                    where: {
                        keluar: {
                            [Op.lt]: moment().subtract(2, 'week').toDate(),
                        },
                        masuk: null,
                        '$palletEntity.status$': 0,
                        '$palletEntity.partEntity.vehicleEntity.customerEntity.name$':
                        data.id,
                        '$palletEntity.partEntity.vehicleEntity.department$': {
                            [Op.in]: data.user.pallet_department,
                        },
                    },
                    include: [
                        {
                            model: PalletEntity,
                            include: [
                                {
                                    model: PartEntity,
                                    include: [
                                        {
                                            model: VehicleEntity,
                                            include: [
                                                {
                                                    model: Customer,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                });
            }
            return datas;
        } catch (e) {
            Logger.log(e);
            throw new RpcException(e ?? new InternalServerErrorException());
        }
    }
}
