import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DishCategoryService } from '../../feature/dish/dish-category.service';
import { DishCategory } from '../../feature/dish/dish.interface';
import { TranslateDirective } from '@wawjs/ngx-translate';

@Component({
	selector: 'app-menu-categories',
	imports: [TranslateDirective],
	templateUrl: './menu-categories.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuCategoriesComponent {
	readonly filteredCategories = input.required<DishCategory[]>();
	readonly filteredSelectedCategories = input.required<DishCategory[]>();
	readonly dishCategoryService = inject(DishCategoryService);
}
