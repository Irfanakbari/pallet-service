import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {CustomerModule} from './customer/customer.module';
import {DestinationModule} from './destination/destination.module';
import {DepartmentModule} from './department/department.module';
import {VehicleModule} from './vehicle/vehicle.module';
import {PartModule} from './part/part.module';
import {PalletModule} from './pallet/pallet.module';
import {Customer} from './customer/entities/customer.entity';
import {DestinationEntity} from './destination/entities/destination.entity';
import {DepartmentEntity} from './department/entities/department.entity';
import {VehicleEntity} from './vehicle/entities/vehicle.entity';
import {PartEntity} from './part/entities/part.entity';
import {PalletEntity} from './pallet/entities/pallet.entity';
import {HistoryEntity} from './history/entities/history.entity';
import {SequelizeModule} from '@nestjs/sequelize';
import {SequelizeTransactionalModule} from 'sequelize-transactional-decorator';
import {HistoryModule} from './history/history.module';
import {HistoryopModule} from './historyop/historyop.module';
import {DashboardModule} from './dashboard/dashboard.module';
import {StockopnameEntity} from './stockopname/entities/stockopname.entity';
import {StockopnameModule} from './stockopname/stockopname.module';
import {StokModule} from './laporan/stok/stok.module';
import {MaintenanceModule} from './laporan/maintenance/maintenance.module';
import {DeliveriesModule} from './deliveries/deliveries.module';
import {DeliveryEntity} from './deliveries/entities/delivery.entity';
import {PalletDeliveryEntity} from './deliveries/entities/pallet-delivery.entity';
import {HistoryopEntity} from './historyop/entities/historyop.entity';
import {PalletDeliveredEntity} from './deliveries/entities/pallet-delivered.entity';
import {OpnameModule} from './laporan/opname/opname.module';
import {StockopnameDetailEntity} from './stockopname/entities/stockopname-detail.entity';
import {RepairsModule} from './repairs/repairs.module';
import {ScheduleModule} from '@nestjs/schedule';
import {CronjobService} from './cronjob/cronjob.service';
import {MailerModule} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import {RawModule} from './ansei/raw/raw.module';
import * as process from "process";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MailerModule.forRoot({
            transport: {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                },
            },
            defaults: {
                from: 'noreply@vuteq.co.id',
            },
            template: {
                dir: __dirname + '/cronjob/',
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
        ScheduleModule.forRoot(),
        SequelizeModule.forRoot({
            dialect: 'mysql',
            host: 'localhost',
            port: 8889,
            username: 'root',
            password: 'root',
            database: 'pallet_db2',
            models: [
                Customer,
                DestinationEntity,
                DepartmentEntity,
                VehicleEntity,
                PartEntity,
                PalletEntity,
                HistoryEntity,
                StockopnameEntity,
                DeliveryEntity,
                PalletDeliveryEntity,
                HistoryopEntity,
                PalletDeliveredEntity,
                StockopnameDetailEntity,
            ],
        }),
        SequelizeTransactionalModule.register(),
        CustomerModule,
        DestinationModule,
        DepartmentModule,
        VehicleModule,
        PartModule,
        PalletModule,
        HistoryModule,
        HistoryopModule,
        DashboardModule,
        StockopnameModule,
        StokModule,
        MaintenanceModule,
        DeliveriesModule,
        OpnameModule,
        RepairsModule,
        RawModule,
    ],
    controllers: [],
    providers: [CronjobService],
})
export class AppModule {
}
