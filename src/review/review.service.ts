import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { parse, HTMLElement } from 'node-html-parser';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  private extractReviewData(root: HTMLElement): {
    reviewBody: string;
    rating: string;
  } {
    const jsonScriptTag = root.querySelector(
      'script[type="application/ld+json"]',
    );

    if (!jsonScriptTag) {
      throw new Error('Review data not found in the page');
    }

    // Clean up the CDATA and comments from the JSON string
    const jsonString = jsonScriptTag.textContent
      .replace(/\/\* <!\[CDATA\[ \*\//, '')
      .replace(/\/\* \]\]> \*\//, '')
      .trim();

    try {
      const reviewData = JSON.parse(jsonString);
      return {
        reviewBody: reviewData.reviewBody,
        rating: reviewData.reviewRating.ratingValue,
      };
    } catch (error) {
      throw new Error('Failed to parse review data: ' + error.message);
    }
  }

  // Note: this does not save the review
  async scrapeReview(reviewUrl: string): Promise<Review> {
    const resp = await fetch(`https://letterboxd.com${reviewUrl}`);
    const parsedBody = parse(await resp.text());
    const { reviewBody, rating } = this.extractReviewData(parsedBody);
    const review = new Review();
    review.content = reviewBody;
    review.star_rating = parseFloat(rating);

    return review;
  }

  save(review: Review) {
    return this.reviewRepository.save(review);
  }

  async saveMany(reviews: Review[]) {
    return this.reviewRepository.manager.transaction(
      async (transactionalEntityManager) => {
        return await transactionalEntityManager.save(Review, reviews);
      },
    );
  }
}
