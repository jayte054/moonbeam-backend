import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReviewService } from '../reviewService/reviewService';
import { ReviewDto } from '../reviewDto/reviewDto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('/writeReview/:email')
  async writeReview(
    @Param('email') email: string,
    @Body() reviewDto: ReviewDto,
  ) {
    return await this.reviewService.writeReview(email, reviewDto);
  }

  @Get('/getReviews')
  async getReviews(@Query('page') page = 1, @Query('limit') limit = 10) {
    return await this.reviewService.getReviews(page, limit);
  }

  @Patch('/changeReviewStatus/:reviewId')
  async changeReviewStatus(@Param('reviewId') reviewId: string) {
    return await this.reviewService.changeReviewStatus(reviewId);
  }

  @Delete('/deleteReview/:reviewId')
  async deleteReview(@Param('reviewId') reviewId: string) {
    return await this.reviewService.deleteReview(reviewId);
  }
}
