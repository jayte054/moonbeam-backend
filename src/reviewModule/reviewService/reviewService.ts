import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../reviewRepository/reviewRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewDto } from '../reviewDto/reviewDto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewRepository)
    private reviewRepository: ReviewRepository,
  ) {}

  writeReview = async (email: string, reviewDto: ReviewDto) => {
    return await this.reviewRepository.writeReview(email, reviewDto);
  };

  getReviews = async (page = 1, limit = 10) => {
    return await this.reviewRepository.getReviews(page, limit);
  };

  changeReviewStatus = async (reviewId: string) => {
    return await this.reviewRepository.changeReviewStatus(reviewId);
  };

  deleteReview = async (reviewId: string) => {
    return await this.reviewRepository.deleteReview(reviewId);
  };
}
