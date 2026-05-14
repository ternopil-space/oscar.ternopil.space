import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MetaService } from '@wawjs/ngx-core';
import { LanguageService, TranslateDirective, TranslateService } from '@wawjs/ngx-translate';
import { companyProfile } from '../../feature/company/company.data';
import type { Discount } from '../../feature/discount/discount.interface';
import {
	DiscountService,
	findFallbackDiscountBySlug,
} from '../../feature/discount/discount.service';
import { CanonicalService } from '../../services/canonical.service';
import { buildAbsoluteUrl } from '../../services/seo.utils';

const _fallbackDiscount = _resolveFallbackDiscount();

@Component({
	imports: [RouterLink, TranslateDirective],
	templateUrl: './discount.component.html',
	styleUrl: './discount.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscountComponent {
	private readonly _canonicalService = inject(CanonicalService);
	private readonly _discountService = inject(DiscountService);
	private readonly _languageService = inject(LanguageService);
	private readonly _metaService = inject(MetaService);
	private readonly _route = inject(ActivatedRoute);
	private readonly _title = inject(Title);
	private readonly _translateService = inject(TranslateService);
	private readonly _slug = toSignal(this._route.paramMap, {
		initialValue: this._route.snapshot.paramMap,
	});

	protected readonly discount = computed(() => {
		const slug = this._slug().get('slug');
		const fromService = this._discountService
			.discounts()
			.find((discount) => discount.slug === slug);

		return fromService ?? (slug ? findFallbackDiscountBySlug(slug) : null) ?? _fallbackDiscount;
	});

	constructor() {
		effect(() => {
			this._discountService.loadTranslations();
		});

		effect(() => {
			this._languageService.language();
			const discount = this.discount();
			const translatedTitle = this._translateService.translate(discount.title)();
			const translatedSummary = this._translateService.translate(discount.summary)();

			this._title.setTitle(`${translatedTitle} | ${companyProfile.name}`);
			this._metaService.applyMeta({
				title: translatedTitle,
				description: translatedSummary,
				image: buildAbsoluteUrl(companyProfile.defaultSeo.image),
			});
			this._canonicalService.setCanonicalUrl(`/discount/${discount.slug}`);
		});
	}
}

function _resolveFallbackDiscount(): Discount {
	const discount = findFallbackDiscountBySlug('');

	if (!discount) {
		throw new Error('No discounts available in discount data.');
	}

	return discount;
}
