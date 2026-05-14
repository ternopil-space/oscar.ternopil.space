import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { LanguageService, TranslateService } from '@wawjs/ngx-translate';
import reviewsData from '../../../data/reviews.json';
import { Review } from './review.interface';

type RawReview = Partial<Review> & Record<string, unknown>;

const REVIEW_TRANSLATION_PATH = '/i18n/review';
const _fallbackReviews: Review[] = _normalizeReviews(reviewsData as RawReview[]);
const _fallbackReviewBySlug = new Map(_fallbackReviews.map((review) => [review.slug, review]));

export const reviewSlugs = _fallbackReviews.map((review) => review.slug);

export function findFallbackReviewBySlug(slug: string) {
	return _fallbackReviewBySlug.get(slug) ?? _fallbackReviews[0] ?? null;
}

@Injectable({
	providedIn: 'root',
})
export class ReviewService {
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _languageService = inject(LanguageService);
	private readonly _translateService = inject(TranslateService);

	readonly reviews = signal<Review[]>(_fallbackReviews);
	readonly isLoading = signal(true);

	loadTranslations() {
		if (!this._isBrowser) {
			return;
		}

		const language = this._languageService.language();

		void this._translateService.loadExtraTranslation(REVIEW_TRANSLATION_PATH, {
			language,
		});
	}

	resolveReviews(reviews: RawReview[] | null | undefined) {
		this.reviews.set(
			Array.isArray(reviews) && reviews.length > 0 ? _normalizeReviews(reviews) : _fallbackReviews,
		);
		this.isLoading.set(false);
	}

	finishLoading() {
		this.isLoading.set(false);
	}
}

function _normalizeReviews(reviews: RawReview[]): Review[] {
	return reviews
		.map((review, index) => _normalizeReview(review, index))
		.filter((review): review is Review => Boolean(review));
}

function _normalizeReview(review: RawReview, index: number): Review | null {
	const author = _stringOrFallback(
		review.author ?? review['name'] ?? review['customer'] ?? review['client'],
	);
	const body = _stringOrFallback(
		review.body ??
			review['text'] ??
			review['review'] ??
			review['content'] ??
			review['message'] ??
			review['description'],
	);

	if (!author || !body) {
		return null;
	}

	const title = _stringOrFallback(review.title ?? review['headline'] ?? review['subject']);
	const slugSource = review.slug ?? review['id'] ?? `${author}-${title || body}`;

	return {
		slug: _slugOrFallback(slugSource, index),
		author,
		title,
		body,
		rating: _ratingOrFallback(review.rating ?? review['stars'] ?? review['score']),
		date: _stringOrFallback(review.date ?? review['publishedAt'] ?? review['createdAt']),
		sourceLabel: _stringOrFallback(
			review.sourceLabel ?? review['source'] ?? review['platform'] ?? review['channel'],
		),
		sourceUrl: _stringOrFallback(review.sourceUrl ?? review['url'] ?? review['link']),
	};
}

function _slugOrFallback(value: unknown, index: number): string {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return `review-${value}`;
	}

	const normalized = _stringOrFallback(value)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

	return normalized || `review-${index + 1}`;
}

function _ratingOrFallback(value: unknown): number {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return Math.max(1, Math.min(5, Math.round(value)));
	}

	if (typeof value === 'string') {
		const numericValue = Number.parseFloat(value);

		if (Number.isFinite(numericValue)) {
			return Math.max(1, Math.min(5, Math.round(numericValue)));
		}
	}

	return 5;
}

function _stringOrFallback(value: unknown, fallback = ''): string {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return String(value);
	}

	return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}
