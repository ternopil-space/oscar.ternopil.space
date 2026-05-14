import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MetaService } from '@wawjs/ngx-core';
import { LanguageService, TranslateDirective, TranslateService } from '@wawjs/ngx-translate';
import type { Article } from '../../feature/article/article.interface';
import { ArticleService, findFallbackArticleBySlug } from '../../feature/article/article.service';
import { companyProfile } from '../../feature/company/company.data';
import { CanonicalService } from '../../services/canonical.service';
import { buildAbsoluteUrl } from '../../services/seo.utils';

const _fallbackArticle = _resolveFallbackArticle();

@Component({
	imports: [RouterLink, TranslateDirective],
	templateUrl: './article.component.html',
	styleUrl: './article.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleComponent {
	private readonly _articleService = inject(ArticleService);
	private readonly _canonicalService = inject(CanonicalService);
	private readonly _languageService = inject(LanguageService);
	private readonly _metaService = inject(MetaService);
	private readonly _route = inject(ActivatedRoute);
	private readonly _title = inject(Title);
	private readonly _translateService = inject(TranslateService);
	private readonly _slug = toSignal(this._route.paramMap, {
		initialValue: this._route.snapshot.paramMap,
	});

	protected readonly article = computed(() => {
		const slug = this._slug().get('slug');
		const fromService = this._articleService
			.articles()
			.find((article) => article.slug === slug);

		return fromService ?? (slug ? findFallbackArticleBySlug(slug) : null) ?? _fallbackArticle;
	});

	constructor() {
		effect(() => {
			this._articleService.loadTranslations();
		});

		effect(() => {
			this._languageService.language();
			const article = this.article();
			const translatedTitle = this._translateService.translate(article.title)();
			const translatedSummary = this._translateService.translate(article.summary)();

			this._title.setTitle(`${translatedTitle} | ${companyProfile.name}`);
			this._metaService.applyMeta({
				title: translatedTitle,
				description: translatedSummary,
				image: buildAbsoluteUrl(companyProfile.defaultSeo.image),
			});
			this._canonicalService.setCanonicalUrl(`/article/${article.slug}`);
		});
	}
}

function _resolveFallbackArticle(): Article {
	const article = findFallbackArticleBySlug('');

	if (!article) {
		throw new Error('No articles available in article data.');
	}

	return article;
}
