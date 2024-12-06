import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MailerService } from 'src/mailerModule/mailerService';
import { DataSource, Repository } from 'typeorm';
import { ReviewEntity } from '../reviewEntity.ts/reviewEntity';
import { ReviewDto, ReviewStatus } from '../reviewDto/reviewDto';
import { ReviewObject } from 'src/types';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ReviewRepository extends Repository<ReviewEntity> {
  private logger = new Logger('ReviewRepository');
  constructor(
    private dataSource: DataSource,
    private mailerService: MailerService,
  ) {
    super(ReviewEntity, dataSource.createEntityManager());
  }

  writeReview = async (
    email: string,
    reviewDto: ReviewDto,
  ): Promise<ReviewObject> => {
    try {
      const { name, review } = reviewDto;

      const newReview = new ReviewEntity();

      newReview.reviewId = uuid();
      newReview.name = name;
      newReview.email = email;
      newReview.review = review;
      newReview.date = new Date().toLocaleString();
      newReview.isActive = ReviewStatus.Inactive;

      await newReview.save();
      this.logger.verbose('review posted successfully');
      return this.mapToReviewResponse(newReview);
    } catch (error) {
      this.logger.error('failed to save review');
      throw new InternalServerErrorException(
        'failed to save review successfully',
      );
    }
  };

  getReviews = async (
    page = 1,
    limit = 10,
  ): Promise<{
    reviews: ReviewObject[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> => {
    try {
      const offset = (page - 1) * limit;

      // Fetch paginated reviews and total count
      const [reviews, total] = await this.findAndCount({
        skip: offset,
        take: limit,
      });

      if (!reviews) {
        this.logger.error('there are no reviews');
      }

      const totalPages = Math.ceil(total / limit);

      return {
        reviews,
        total,
        currentPage: page,
        totalPages,
      };
    } catch (error) {
      this.logger.error('failed to fetch reviews');
      throw new InternalServerErrorException('failed to retrieve reviews');
    }
  };

  changeReviewStatus = async (reviewId: string): Promise<ReviewObject> => {
    try {
      const review = await this.findOne({
        where: {
          reviewId,
        },
      });

      if (!review) {
        throw new NotFoundException('failed to find review with id', reviewId);
      }

      review.isActive =
        review.isActive === ReviewStatus.Inactive
          ? ReviewStatus.Active
          : ReviewStatus.Inactive;

      await review.save();
      this.logger.verbose(
        'review status successfully changed to ',
        review.isActive,
      );
      return review;
    } catch (error) {
      this.logger.error(
        `Failed to change review status for ID ${reviewId}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to update review status');
    }
  };

  deleteReview = async (reviewId: string): Promise<string> => {
    try {
      const review = await this.findOne({
        where: { reviewId },
      });
      if (!review) {
        throw new NotFoundException(`Review with ID ${reviewId} not found`);
      }

      // Remove the review
      await this.remove(review);
      this.logger.verbose(`Successfully deleted review with ID: ${reviewId}`);
      return 'review successfully deleted';
    } catch (error) {
      throw new InternalServerErrorException('failed to delete review');
    }
  };

  private mapToReviewResponse = (review: ReviewObject) => {
    return {
      reviewId: review.reviewId,
      email: review.email,
      name: review.name,
      review: review.review,
      isActive: review.isActive,
      date: review.date,
    };
  };
}
