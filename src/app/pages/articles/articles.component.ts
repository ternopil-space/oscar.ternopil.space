import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { ArticleService } from '../../feature/article/article.service';

@Component({
	imports: [RouterLink, TranslateDirective],
	templateUrl: './articles.component.html',
	styleUrl: './articles.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesComponent {
	private readonly _articleService = inject(ArticleService);

	protected readonly loadingCards = [1, 2, 3];
	protected readonly articles = this._articleService.articles;
	protected readonly isLoading = this._articleService.isLoading;
	protected readonly hasArticles = computed(() => this.articles().length > 0);

	constructor() {
		effect(() => {
			this._articleService.loadTranslations();
		});
	}
}
