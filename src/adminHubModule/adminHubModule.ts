import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/authModule/authmodule';
import { ProductRateEntity } from './productRateEntity/productRateEntity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([ProductRateEntity])],
  providers: [],
  controllers: [],
  exports: [],
})
export class AdminHubModule {}
