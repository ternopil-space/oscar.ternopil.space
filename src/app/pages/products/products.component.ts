import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { ProductService } from '../../feature/product/product.service';

@Component({
	imports: [RouterLink, TranslateDirective],
	templateUrl: './products.component.html',
	styleUrl: './products.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent {
	private readonly _productService = inject(ProductService);

	protected readonly products = this._productService.products;
	protected readonly isLoading = this._productService.isLoading;

	constructor() {
		effect(() => {
			this._productService.loadTranslations();
		});
	}
}
