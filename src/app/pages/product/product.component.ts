import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MetaService } from '@wawjs/ngx-core';
import { LanguageService, TranslateDirective, TranslateService } from '@wawjs/ngx-translate';
import { companyProfile } from '../../feature/company/company.data';
import type { Product } from '../../feature/product/product.interface';
import { ProductService, findFallbackProductBySlug } from '../../feature/product/product.service';
import { CanonicalService } from '../../services/canonical.service';
import { buildAbsoluteUrl } from '../../services/seo.utils';

const _fallbackProduct = _resolveFallbackProduct();

@Component({
	imports: [RouterLink, TranslateDirective],
	templateUrl: './product.component.html',
	styleUrl: './product.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComponent {
	private readonly _canonicalService = inject(CanonicalService);
	private readonly _languageService = inject(LanguageService);
	private readonly _metaService = inject(MetaService);
	private readonly _productService = inject(ProductService);
	private readonly _route = inject(ActivatedRoute);
	private readonly _title = inject(Title);
	private readonly _translateService = inject(TranslateService);
	private readonly _slug = toSignal(this._route.paramMap, {
		initialValue: this._route.snapshot.paramMap,
	});

	protected readonly product = computed(() => {
		const slug = this._slug().get('slug');
		const fromService = this._productService
			.products()
			.find((product) => product.slug === slug);

		return fromService ?? (slug ? findFallbackProductBySlug(slug) : null) ?? _fallbackProduct;
	});

	constructor() {
		effect(() => {
			this._productService.loadTranslations();
		});

		effect(() => {
			this._languageService.language();
			const product = this.product();
			const translatedTitle = this._translateService.translate(product.title)();
			const translatedSummary = this._translateService.translate(product.summary)();

			this._title.setTitle(`${translatedTitle} | ${companyProfile.name}`);
			this._metaService.applyMeta({
				title: translatedTitle,
				description: translatedSummary,
				image: buildAbsoluteUrl(companyProfile.defaultSeo.image),
			});
			this._canonicalService.setCanonicalUrl(`/product/${product.slug}`);
		});
	}
}

function _resolveFallbackProduct(): Product {
	const product = findFallbackProductBySlug('');

	if (!product) {
		throw new Error('No products available in product data.');
	}

	return product;
}
