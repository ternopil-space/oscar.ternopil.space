import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { DiscountService } from '../../feature/discount/discount.service';

@Component({
	imports: [RouterLink, TranslateDirective],
	templateUrl: './discounts.component.html',
	styleUrl: './discounts.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscountsComponent {
	private readonly _discountService = inject(DiscountService);

	protected readonly loadingCards = [1, 2, 3];
	protected readonly discounts = this._discountService.discounts;
	protected readonly isLoading = this._discountService.isLoading;
	protected readonly hasDiscounts = computed(() => this.discounts().length > 0);

	constructor() {
		effect(() => {
			this._discountService.loadTranslations();
		});
	}
}
