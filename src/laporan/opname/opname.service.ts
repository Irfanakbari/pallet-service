import {Injectable} from '@nestjs/common';
import {CreateOpnameDto} from './dto/create-opname.dto';
import {UpdateOpnameDto} from './dto/update-opname.dto';
import {InjectModel} from '@nestjs/sequelize';
import {StockopnameEntity} from '../../stockopname/entities/stockopname.entity';
import {StockopnameDetailEntity} from '../../stockopname/entities/stockopname-detail.entity';
import {PalletEntity} from '../../pallet/entities/pallet.entity';
import {VehicleEntity} from '../../vehicle/entities/vehicle.entity';
import {PartEntity} from '../../part/entities/part.entity';
import sequelize, {Op} from 'sequelize';

@Injectable()
export class OpnameService {
    constructor(
        @InjectModel(StockopnameEntity)
        private soRepo: typeof StockopnameEntity,
        @InjectModel(PalletEntity)
        private palletRepo: typeof PalletEntity,
        @InjectModel(StockopnameDetailEntity)
        private soDetail: typeof StockopnameDetailEntity,
    ) {
    }

    create(createOpnameDto: CreateOpnameDto) {
        return 'This action adds a new opname';
    }

    async findAll() {
        const stokOpname = await this.soRepo.findAll();

        await Promise.all(
            stokOpname.map(async (so) => {
                const detailSo = await this.soDetail.findAll({
                    where: {
                        so_id: so.kode,
                    },
                    include: [
                        {
                            model: PalletEntity,
                            include: [
                                {
                                    model: PartEntity,
                                    include: [VehicleEntity],
                                },
                            ],
                        },
                    ],
                });

                const departments = [
                    ...new Set(
                        detailSo.map(
                            (dso) => dso.palletEntity.partEntity.vehicleEntity.department,
                        ),
                    ),
                ];

                const stokSistemByDepartmentAndPart = await this.palletRepo.findAll({
                    attributes: [
                        [sequelize.fn('COUNT', sequelize.col('*')), 'total_stok_sistem'],
                        [
                            sequelize.col('partEntity.vehicleEntity.department'),
                            'department',
                        ],
                        [sequelize.col('partEntity.name'), 'part'],
                    ],
                    where: {
                        '$partEntity.vehicleEntity.department$': {
                            [Op.in]: departments,
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
                    group: [
                        sequelize.col('partEntity.vehicleEntity.department'),
                        sequelize.col('partEntity.name'),
                    ],
                });

                const stokSistemMapByDepartmentAndPart =
                    stokSistemByDepartmentAndPart.reduce((map, item) => {
                        const department: any = item.get('department');
                        const part = item.get('part');
                        const totalStokSistem = item.get('total_stok_sistem');

                        map[department] = map[department] || {};
                        map[department][part] =
                            (map[department][part] || 0) + totalStokSistem;

                        return map;
                    }, {});

                const dataByDepartment = {};

                for (const dso of detailSo) {
                    const department =
                        dso.palletEntity.partEntity.vehicleEntity.department;
                    const part = dso.palletEntity.partEntity.name;

                    const departmentName = `Produksi ${department}`;

                    dataByDepartment[departmentName] = dataByDepartment[
                        departmentName
                        ] || {
                        total_stok_aktual: 0,
                        total_di_sistem: 0,
                        selisih: 0,
                        data_by_part: {},
                    };

                    dataByDepartment[departmentName].total_stok_aktual = detailSo.filter(
                        (d) =>
                            d.palletEntity.partEntity.vehicleEntity.department === department,
                    ).length;

                    dataByDepartment[departmentName].total_di_sistem = Object.values(
                        stokSistemMapByDepartmentAndPart[department] || {},
                    ).reduce((total: number, count: number) => total + count, 0);

                    dataByDepartment[departmentName].selisih =
                        dataByDepartment[departmentName].total_stok_aktual -
                        dataByDepartment[departmentName].total_di_sistem;

                    if (!dataByDepartment[departmentName].data_by_part[part]) {
                        dataByDepartment[departmentName].data_by_part[part] = {
                            stok_aktual: 0,
                            stok_sistem: 0,
                            selisih: 0,
                        };
                    }

                    dataByDepartment[departmentName].data_by_part[part].stok_aktual =
                        detailSo.filter(
                            (d) => d.palletEntity.partEntity.name === part,
                        ).length;
                    dataByDepartment[departmentName].data_by_part[part].stok_sistem =
                        stokSistemMapByDepartmentAndPart[department][part] || 0;
                    dataByDepartment[departmentName].data_by_part[part].selisih =
                        dataByDepartment[departmentName].data_by_part[part].stok_aktual -
                        dataByDepartment[departmentName].data_by_part[part].stok_sistem;
                }

                const transformedData = Object.entries(dataByDepartment).map(
                    ([departmentName, data]: [departmentName: any, data: any]) => {
                        const transformedDataByPart = Object.entries(data.data_by_part).map(
                            ([part, partData]: [part: any, partData: any]) => ({
                                part,
                                stok_aktual_part: partData.stok_aktual,
                                stok_sistem_part: partData.stok_sistem,
                                selisih_part: partData.selisih,
                            }),
                        );
                        return {
                            department: departmentName,
                            stok_aktual_department: data.total_stok_aktual,
                            stok_sistem_department: data.total_di_sistem,
                            selisih_department: data.selisih,
                            data: transformedDataByPart,
                        };
                    },
                );

                return {
                    id_so: so.kode,
                    catatan: so.catatan,
                    tanggal_mulai: so.tanggal_so,
                    tanggal_akhir: so.tanggal_so_closed,
                    status: so.status === 1 ? 'Dibuka' : 'Ditutup',
                    sudah_dihitung: detailSo.length,
                    belum_dihitung: (await this.palletRepo.count()) - detailSo.length,
                    data: transformedData,
                };
            }),
        );
    }

    findOne(id: number) {
        return `This action returns a #${id} opname`;
    }

    update(id: number, updateOpnameDto: UpdateOpnameDto) {
        return `This action updates a #${id} opname`;
    }

    remove(id: number) {
        return `This action removes a #${id} opname`;
    }
}
