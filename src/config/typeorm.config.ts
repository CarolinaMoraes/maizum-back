import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    console.log('>>>>>>>>>>>>>>>>');
    console.log('name: ' + process.env.DB_NAME);
    console.log('host: ' + process.env.DB_HOST);
    console.log('port: ' + process.env.DB_PORT);
    console.log('username: ' + process.env.DB_USERNAME);
    console.log('password: ' + process.env.DB_PASSWORD);

    return {
      type: 'postgres',
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      synchronize: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
    };
  }
}
