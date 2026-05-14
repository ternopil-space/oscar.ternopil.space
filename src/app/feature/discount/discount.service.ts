import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { LanguageService, TranslateService } from '@wawjs/ngx-translate';
import discountsData from '../../../data/discounts.json';
import { Discount } from './discount.interface';

type RawDiscount = Partial<Discount> & Record<string, unknown>;

const DISCOUNT_TRANSLATION_PATH = '/i18n/discount';
const _fallbackDiscounts = _normalizeDiscounts(discountsData as RawDiscount[]);
const _fallbackDiscountBySlug = new Map(
	_fallbackDiscounts.map((discount) => [discount.slug, discount]),
);

export const discountSlugs = _fallbackDiscounts.map((discount) => discount.slug);

export function findFallbackDiscountBySlug(slug: string) {
	return _fallbackDiscountBySlug.get(slug) ?? _fallbackDiscounts[0] ?? null;
}

@Injectable({
	providedIn: 'root',
})
export class DiscountService {
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _languageService = inject(LanguageService);
	private readonly _translateService = inject(TranslateService);

	readonly discounts = signal<Discount[]>(_fallbackDiscounts);
	readonly isLoading = signal(true);

	loadTranslations() {
		if (!this._isBrowser) {
			return;
		}

		const language = this._languageService.language();

		void this._translateService.loadExtraTranslation(DISCOUNT_TRANSLATION_PATH, {
			language,
		});
	}

	resolveDiscounts(discounts: RawDiscount[] | null | undefined) {
		this.discounts.set(
			Array.isArray(discounts) && discounts.length > 0
				? _normalizeDiscounts(discounts)
				: _fallbackDiscounts,
		);
		this.isLoading.set(false);
	}

	finishLoading() {
		this.isLoading.set(false);
	}
}

function _normalizeDiscounts(discounts: RawDiscount[]) {
	return discounts
		.map((discount, index) => _normalizeDiscount(discount, index))
		.filter((discount): discount is Discount => Boolean(discount));
}

function _normalizeDiscount(discount: RawDiscount, index: number): Discount | null {
	const title = _stringOrFallback(
		discount.title ?? discount['name'] ?? discount['headline'],
	);
	const summary = _stringOrFallback(
		discount.summary ?? discount['excerpt'] ?? discount['description'],
	);

	if (!title || !summary) {
		return null;
	}

	const slugSource = discount.slug ?? discount['id'] ?? title;

	return {
		slug: _slugOrFallback(slugSource, index),
		title,
		summary,
		description: _stringOrFallback(discount.description ?? discount['details']),
		badge: _stringOrFallback(discount.badge ?? discount['label'] ?? discount['category']),
		period: _stringOrFallback(
			discount.period ?? discount['dateRange'] ?? discount['validUntil'],
		),
		terms: _stringOrFallback(discount.terms ?? discount['conditions']),
		ctaLabel: _stringOrFallback(discount.ctaLabel ?? discount['buttonLabel']),
		ctaUrl: _stringOrFallback(discount.ctaUrl ?? discount['url']),
		body: _stringsOrFallback(discount.body, [
			_stringOrFallback(discount.description ?? discount['details'], summary),
		]),
		highlights: _stringsOrFallback(discount.highlights, []),
	};
}

function _slugOrFallback(value: unknown, index: number): string {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return `discount-${value}`;
	}

	const normalized = _stringOrFallback(value)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

	return normalized || `discount-${index + 1}`;
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
