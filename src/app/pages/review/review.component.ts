import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MetaService } from '@wawjs/ngx-core';
import { LanguageService, TranslateDirective, TranslateService } from '@wawjs/ngx-translate';
import { companyProfile } from '../../feature/company/company.data';
import type { Review } from '../../feature/review/review.interface';
import { ReviewService, findFallbackReviewBySlug } from '../../feature/review/review.service';
import { CanonicalService } from '../../services/canonical.service';
import { buildAbsoluteUrl } from '../../services/seo.utils';

const _fallbackReview = _resolveFallbackReview();

@Component({
	imports: [RouterLink, TranslateDirective],
	templateUrl: './review.component.html',
	styleUrl: './review.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewComponent {
	private readonly _canonicalService = inject(CanonicalService);
	private readonly _languageService = inject(LanguageService);
	private readonly _metaService = inject(MetaService);
	private readonly _reviewService = inject(ReviewService);
	private readonly _route = inject(ActivatedRoute);
	private readonly _title = inject(Title);
	private readonly _translateService = inject(TranslateService);
	private readonly _slug = toSignal(this._route.paramMap, {
		initialValue: this._route.snapshot.paramMap,
	});

	protected readonly stars = [1, 2, 3, 4, 5];
	protected readonly review = computed(() => {
		const slug = this._slug().get('slug');
		const fromService = this._reviewService.reviews().find((review) => review.slug === slug);

		return fromService ?? (slug ? findFallbackReviewBySlug(slug) : null) ?? _fallbackReview;
	});

	constructor() {
		effect(() => {
			this._reviewService.loadTranslations();
		});

		effect(() => {
			this._languageService.language();
			const review = this.review();
			const titleKey = review.title || review.author;
			const translatedTitle = this._translateService.translate(titleKey)();
			const translatedBody = this._translateService.translate(review.body)();

			this._title.setTitle(`${translatedTitle} | ${companyProfile.name}`);
			this._metaService.applyMeta({
				title: translatedTitle,
				description: translatedBody,
				image: buildAbsoluteUrl(companyProfile.defaultSeo.image),
			});
			this._canonicalService.setCanonicalUrl(`/review/${review.slug}`);
		});
	}
}

function _resolveFallbackReview(): Review {
	const review = findFallbackReviewBySlug('');

	if (!review) {
		throw new Error('No reviews available in review data.');
	}

	return review;
}
