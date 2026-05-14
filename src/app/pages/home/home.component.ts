import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { ArticleService } from '../../feature/article/article.service';
import { companyProfile } from '../../feature/company/company.data';
import { DiscountService } from '../../feature/discount/discount.service';
import { EventService } from '../../feature/event/event.service';
import { JobService } from '../../feature/job/job.service';
import { ProductService } from '../../feature/product/product.service';
import { ProfileService } from '../../feature/profile/profile.service';
import { QuestService } from '../../feature/quest/quest.service';
import { ReviewService } from '../../feature/review/review.service';
import { RoomService } from '../../feature/room/room.service';

type FeaturePreview = {
	eyebrow: string;
	title: string;
	summary: string;
	meta?: string;
	itemRoute: string;
	allRoute: string;
	seeAllLabel: string;
	imageSrc?: string;
	imageAlt?: string;
};

@Component({
	imports: [NgOptimizedImage, RouterLink, TranslateDirective],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
	private readonly _articleService = inject(ArticleService);
	private readonly _discountService = inject(DiscountService);
	private readonly _eventService = inject(EventService);
	private readonly _jobService = inject(JobService);
	private readonly _productService = inject(ProductService);
	private readonly _profileService = inject(ProfileService);
	private readonly _questService = inject(QuestService);
	private readonly _reviewService = inject(ReviewService);
	private readonly _roomService = inject(RoomService);

	protected readonly company = companyProfile;
	protected readonly horecaHighlights = [
		'Restaurants, cafes, hotels, bars, and catering teams can present the essentials in one place.',
		'Guests can move from discovery to action through menu browsing, venue context, social proof, and contact options.',
		'Static, SEO-friendly pages keep core business information easy to scan on desktop and mobile.',
	];
	protected readonly featurePreviews = computed(() => {
		const article = this._articleService.articles()[0];
		const discount = this._discountService.discounts()[0];
		const event = this._eventService.events()[0];
		const job = this._jobService.jobs()[0];
		const product = this._productService.products()[0];
		const profile = this._profileService.profiles()[0];
		const quest = this._questService.quests()[0];
		const review = this._reviewService.reviews()[0];
		const room = this._roomService.rooms()[0];
		const previews: Array<FeaturePreview | null> = [
			article
				? {
						eyebrow: 'Article',
						title: article.title,
						summary: article.summary,
						meta: article.category,
						itemRoute: `/article/${article.slug}`,
						allRoute: '/articles',
						seeAllLabel: 'See all articles',
					}
				: null,
			room
				? {
						eyebrow: 'Room',
						title: room.name,
						summary: room.description,
						meta: room.price,
						itemRoute: `/room/${room.slug}`,
						allRoute: '/rooms',
						seeAllLabel: 'See all rooms',
						imageSrc: room.image,
						imageAlt: room.imageAlt,
					}
				: null,
			discount
				? {
						eyebrow: 'Discount',
						title: discount.title,
						summary: discount.summary,
						meta: discount.period,
						itemRoute: `/discount/${discount.slug}`,
						allRoute: '/discounts',
						seeAllLabel: 'See all discounts',
					}
				: null,
			event
				? {
						eyebrow: 'Event',
						title: event.title,
						summary: event.summary,
						meta: event.dateLabel,
						itemRoute: `/event/${event.slug}`,
						allRoute: '/events',
						seeAllLabel: 'See all events',
					}
				: null,
			product
				? {
						eyebrow: 'Product',
						title: product.title,
						summary: product.summary,
						meta: product.price,
						itemRoute: `/product/${product.slug}`,
						allRoute: '/products',
						seeAllLabel: 'See all products',
					}
				: null,
			review
				? {
						eyebrow: 'Review',
						title: review.title,
						summary: review.body,
						meta: review.author,
						itemRoute: `/review/${review.slug}`,
						allRoute: '/reviews',
						seeAllLabel: 'See all reviews',
					}
				: null,
			quest
				? {
						eyebrow: 'Quest',
						title: quest.title,
						summary: quest.summary,
						meta: quest.duration,
						itemRoute: `/quest/${quest.slug}`,
						allRoute: '/quests',
						seeAllLabel: 'See all quests',
					}
				: null,
			job
				? {
						eyebrow: 'Job',
						title: job.title,
						summary: job.summary,
						meta: job.location,
						itemRoute: `/job/${job.slug}`,
						allRoute: '/jobs',
						seeAllLabel: 'See all jobs',
					}
				: null,
			profile
				? {
						eyebrow: 'Team profile',
						title: profile.name,
						summary: profile.description,
						meta: profile.role,
						itemRoute: `/profile/${profile.slug}`,
						allRoute: '/team',
						seeAllLabel: 'See all team members',
						imageSrc: profile.image,
						imageAlt: profile.name,
					}
				: null,
		];

		return previews.filter((preview): preview is FeaturePreview => preview !== null);
	});

	constructor() {
		effect(() => {
			this._articleService.loadTranslations();
			this._discountService.loadTranslations();
			this._eventService.loadTranslations();
			this._jobService.loadTranslations();
			this._productService.loadTranslations();
			this._profileService.loadTranslations();
			this._questService.loadTranslations();
			this._reviewService.loadTranslations();
			this._roomService.loadTranslations();
		});
	}
}
