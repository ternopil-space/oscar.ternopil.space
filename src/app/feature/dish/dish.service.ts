import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { LanguageService, TranslateService } from '@wawjs/ngx-translate';
import dishesData from '../../../data/dishes.json';
import { Dish } from './dish.interface';

const FAVORITE_DISHES_STORAGE_KEY = 'favorite-dishes';
const DISH_TRANSLATION_PATH = '/i18n/dish';

const _fallbackDishes: Dish[] = (dishesData as Dish[]).map((dish) => ({
	...dish,
	price: dish.price ?? 0,
	description: dish.description ?? '',
	fullDescription: dish.fullDescription ?? '',
	labels: dish.labels ?? [],
	suggested: dish.suggested ?? [],
	cookTimeMinutes: dish.cookTimeMinutes ?? 0,
	caloriesKcal: dish.caloriesKcal ?? 0,
	portion: dish.portion ?? '',
	allergens: dish.allergens ?? [],
}));

@Injectable({
	providedIn: 'root',
})
export class DishService {
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _isBrowser = isPlatformBrowser(this._platformId);
	private readonly _languageService = inject(LanguageService);
	private readonly _translateService = inject(TranslateService);

	readonly dishes = signal<Dish[]>(_fallbackDishes);
	readonly favoriteDishes = signal<string[]>(this._readFavoriteDishes());

	loadTranslations() {
		if (!this._isBrowser) {
			return;
		}

		const language = this._languageService.language();

		void this._translateService.loadExtraTranslation(DISH_TRANSLATION_PATH, {
			language,
		});
	}

	togglerDishFavorite(slug: string) {
		const nextFavorites = this.favoriteDishes().includes(slug)
			? this.favoriteDishes().filter((favoriteSlug) => favoriteSlug !== slug)
			: [...this.favoriteDishes(), slug];

		this.favoriteDishes.set(nextFavorites);
		this._persistFavoriteDishes(nextFavorites);
	}

	private _readFavoriteDishes() {
		if (!this._isBrowser) {
			return [];
		}

		const rawValue = localStorage.getItem(FAVORITE_DISHES_STORAGE_KEY);

		if (!rawValue) {
			return [];
		}

		try {
			const favoriteDishes = JSON.parse(rawValue);

			return Array.isArray(favoriteDishes)
				? favoriteDishes.filter(
						(favoriteDish): favoriteDish is string =>
							typeof favoriteDish === 'string',
					)
				: [];
		} catch {
			return [];
		}
	}

	private _persistFavoriteDishes(favoriteDishes: string[]) {
		if (!this._isBrowser) {
			return;
		}

		localStorage.setItem(
			FAVORITE_DISHES_STORAGE_KEY,
			JSON.stringify(favoriteDishes),
		);
	}
}
