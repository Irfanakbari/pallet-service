import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Transport} from '@nestjs/microservices';
import {initSequelizeCLS} from 'sequelize-transactional-decorator';

initSequelizeCLS();

async function bootstrap() {
    const app = await NestFactory.createMicroservice(AppModule, {
        transport: Transport.TCP,
        options: {
            host: 'localhost',
            port: 3200,
        },
    });
    await app.listen();
}

bootstrap();
