import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './authModule/authmodule';
import { MailerModule } from './mailerModule/mailerModule';
import { typeOrmConfig } from './typeormConfig/typeorm.config';
import { ProductsModule } from './products/products.module';
import { CloudinaryModule } from './cloudinary/cloudinaryModule';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    MailerModule,
    ProductsModule,
    CloudinaryModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
