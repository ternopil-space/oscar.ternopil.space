import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DishCategoryService } from '../../feature/dish/dish-category.service';
import { toDishCard } from '../../feature/dish/dish.data';
import { Dish, DishCard, DishCategory } from '../../feature/dish/dish.interface';
import { DishService } from '../../feature/dish/dish.service';
import { MenuDishComponent } from '../menu-dish/menu-dish.component';
import { TranslateDirective } from '@wawjs/ngx-translate';

interface DishSection {
	id: string;
	name: string;
	description: string;
	hasDescription: boolean;
	dishes: DishCard[];
}

@Component({
	selector: 'app-menu-dishes',
	imports: [MenuDishComponent, TranslateDirective],
	templateUrl: './menu-dishes.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuDishesComponent {
	private readonly _dishService = inject(DishService);
	private readonly _dishCategoryService = inject(DishCategoryService);
	readonly selectedCategories = input<DishCategory[]>();

	readonly categories = computed(() => {
		const selectedCategories =
			this.selectedCategories() ?? this._dishCategoryService.selectedCategories();
		const lastSelectedCategory = selectedCategories[selectedCategories.length - 1];

		if (lastSelectedCategory?.children?.length) {
			return lastSelectedCategory.children;
		}

		if (lastSelectedCategory) {
			return [lastSelectedCategory];
		}

		return this._dishCategoryService.flatCategories().filter((category) => !category.parent);
	});

	protected readonly sections = computed(() =>
		this.categories()
			.map((category) =>
				this._toSection(
					category,
					this.dishCardsByCategory(),
					this._dishCategoryService.flatCategories(),
				),
			)
			.filter((section) => section.dishes.length > 0),
	);

	private readonly dishCardsByCategory = computed(() => {
		const dishCardsByCategory = new Map<string, DishCard[]>();

		for (const dish of this._dishService.dishes()) {
			const dishCard = this._toMenuDish(dish);
			const dishes = dishCardsByCategory.get(dish.categorySlug);

			if (dishes) {
				dishes.push(dishCard);
			} else {
				dishCardsByCategory.set(dish.categorySlug, [dishCard]);
			}
		}

		return dishCardsByCategory;
	});

	private _toSection(
		category: DishCategory,
		dishCardsByCategory: Map<string, DishCard[]>,
		categories: DishCategory[],
	): DishSection {
		return {
			id: category.slug,
			name: category.name,
			description: category.description,
			hasDescription: Boolean(category.description?.trim()),
			dishes: this._collectDishes(category, dishCardsByCategory, categories),
		};
	}

	private _collectDishes(
		category: DishCategory,
		dishCardsByCategory: Map<string, DishCard[]>,
		categories: DishCategory[],
	): DishCard[] {
		const categorySlugs = [
			category.slug,
			...categories
				.filter((entry) => entry.parent === category.slug)
				.map((entry) => entry.slug),
		];

		return categorySlugs.flatMap((categorySlug) => dishCardsByCategory.get(categorySlug) ?? []);
	}

	private _toMenuDish(dish: Dish): DishCard {
		return toDishCard(dish);
	}
}
