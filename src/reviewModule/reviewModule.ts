import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/authModule/authmodule';
import { MailerModule } from 'src/mailerModule/mailerModule';
import { ReviewEntity } from './reviewEntity.ts/reviewEntity';
import { ReviewRepository } from './reviewRepository/reviewRepository';
import { ReviewService } from './reviewService/reviewService';
import { ReviewController } from './ReviewController/reviewController';

@Module({
  imports: [AuthModule, MailerModule, TypeOrmModule.forFeature([ReviewEntity])],
  providers: [ReviewRepository, ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
