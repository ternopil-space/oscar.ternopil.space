import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { LanguageService, TranslateService } from '@wawjs/ngx-translate';
import productsData from '../../../data/products.json';
import { Product } from './product.interface';

type RawProduct = Partial<Product> & Record<string, unknown>;

const PRODUCT_TRANSLATION_PATH = '/i18n/product';
const _fallbackProducts: Product[] = _normalizeProducts(productsData as RawProduct[]);
const _fallbackProductBySlug = new Map(
	_fallbackProducts.map((product) => [product.slug, product]),
);

export const productSlugs = _fallbackProducts.map((product) => product.slug);

export function findFallbackProductBySlug(slug: string) {
	return _fallbackProductBySlug.get(slug) ?? _fallbackProducts[0] ?? null;
}

@Injectable({
	providedIn: 'root',
})
export class ProductService {
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _languageService = inject(LanguageService);
	private readonly _translateService = inject(TranslateService);

	readonly products = signal<Product[]>(_fallbackProducts);
	readonly isLoading = signal(true);

	loadTranslations() {
		if (!this._isBrowser) {
			return;
		}

		const language = this._languageService.language();

		void this._translateService.loadExtraTranslation(PRODUCT_TRANSLATION_PATH, {
			language,
		});
	}

	resolveProducts(products: RawProduct[] | null | undefined) {
		this.products.set(
			Array.isArray(products) && products.length > 0
				? _normalizeProducts(products)
				: _fallbackProducts,
		);
		this.isLoading.set(false);
	}

	finishLoading() {
		this.isLoading.set(false);
	}
}

function _normalizeProducts(products: RawProduct[]): Product[] {
	return products
		.map((product, index) => _normalizeProduct(product, index))
		.filter((product): product is Product => Boolean(product));
}

function _normalizeProduct(product: RawProduct, index: number): Product | null {
	const title = _stringOrFallback(
		product.title ?? product['name'] ?? product['productTitle'] ?? product['label'],
	);

	if (!title) {
		return null;
	}

	const slugSource = product.slug ?? product['id'] ?? title;

	return {
		slug: _slugOrFallback(slugSource, index),
		title,
		summary: _stringOrFallback(product.summary ?? product['description']),
		details: _stringsOrFallback(product.details, []),
		highlights: _stringsOrFallback(product.highlights, []),
		price: _stringOrFallback(
			product.price ?? product['priceLabel'] ?? product['cost'] ?? product['amount'],
		),
		category: _stringOrFallback(product.category ?? product['type'] ?? product['group']),
		badge: _stringOrFallback(product.badge ?? product['tag'] ?? product['status']),
		ctaLabel: _stringOrFallback(
			product.ctaLabel ?? product['buttonLabel'] ?? product['linkText'],
		),
		ctaHref: _stringOrFallback(product.ctaHref ?? product['url'] ?? product['link']),
	};
}

function _slugOrFallback(value: unknown, index: number): string {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return `product-${value}`;
	}

	const normalized = _stringOrFallback(value)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

	return normalized || `product-${index + 1}`;
}

function _stringOrFallback(value: unknown, fallback = ''): string {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return String(value);
	}

	return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}

function _stringsOrFallback(value: unknown, fallback: string[]): string[] {
	if (!Array.isArray(value)) {
		return fallback;
	}

	const strings = value
		.map((item) => _stringOrFallback(item))
		.filter((item) => item.length > 0);

	return strings.length ? strings : fallback;
}
