import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TypeOrmConfigService } from './config/typeorm.config';
import { UsersModule } from './users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as aws from '@aws-sdk/client-ses';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    UsersModule,
    AuthModule,
    MailerModule.forRoot({
      transport: {
        SES: {
          ses: new aws.SES({
            region: 'us-east-1',
            credentials: {
              secretAccessKey: process.env.AWS_SES_PASSWORD,
              accessKeyId: process.env.AWS_SES_ACCESS_KEY,
            },
          }),
          aws,
        },
      },
      defaults: {
        from: '"Maizum" <carolina.cloud3000@gmail.com>',
      },
      template: {
        dir: join(__dirname, '..', 'src/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
})
export class AppModule {}
