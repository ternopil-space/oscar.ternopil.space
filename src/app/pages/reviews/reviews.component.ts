import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { ReviewService } from '../../feature/review/review.service';

@Component({
	imports: [RouterLink, TranslateDirective],
	templateUrl: './reviews.component.html',
	styleUrl: './reviews.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewsComponent {
	private readonly _reviewService = inject(ReviewService);

	protected readonly reviews = this._reviewService.reviews;
	protected readonly isLoading = this._reviewService.isLoading;
	protected readonly stars = [1, 2, 3, 4, 5];

	constructor() {
		effect(() => {
			this._reviewService.loadTranslations();
		});
	}
}
