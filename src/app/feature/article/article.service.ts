import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { LanguageService, TranslateService } from '@wawjs/ngx-translate';
import articlesData from '../../../data/articles.json';
import { Article } from './article.interface';

type RawArticle = Partial<Article> & Record<string, unknown>;

const ARTICLE_TRANSLATION_PATH = '/i18n/article';
const _fallbackArticles: Article[] = _normalizeArticles(articlesData as RawArticle[]);
const _fallbackArticleBySlug = new Map(_fallbackArticles.map((article) => [article.slug, article]));

export const articleSlugs = _fallbackArticles.map((article) => article.slug);

export function findFallbackArticleBySlug(slug: string) {
	return _fallbackArticleBySlug.get(slug) ?? _fallbackArticles[0] ?? null;
}

@Injectable({
	providedIn: 'root',
})
export class ArticleService {
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _languageService = inject(LanguageService);
	private readonly _translateService = inject(TranslateService);

	readonly articles = signal<Article[]>(_fallbackArticles);
	readonly isLoading = signal(true);

	loadTranslations() {
		if (!this._isBrowser) {
			return;
		}

		const language = this._languageService.language();

		void this._translateService.loadExtraTranslation(ARTICLE_TRANSLATION_PATH, {
			language,
		});
	}

	resolveArticles(articles: RawArticle[] | null | undefined) {
		this.articles.set(
			Array.isArray(articles) && articles.length > 0
				? _normalizeArticles(articles)
				: _fallbackArticles,
		);
		this.isLoading.set(false);
	}

	finishLoading() {
		this.isLoading.set(false);
	}
}

function _normalizeArticles(articles: RawArticle[]) {
	return articles
		.map((article, index) => _normalizeArticle(article, index))
		.filter((article): article is Article => Boolean(article));
}

function _normalizeArticle(article: RawArticle, index: number): Article | null {
	const title = _stringOrFallback(article.title ?? article['name'] ?? article['headline']);
	const summary = _stringOrFallback(
		article.summary ?? article['excerpt'] ?? article['description'],
	);

	if (!title || !summary) {
		return null;
	}

	const slugSource = article.slug ?? article['id'] ?? title;

	return {
		slug: _slugOrFallback(slugSource, index),
		title,
		summary,
		category: _stringOrFallback(article.category ?? article['tag'], 'Article'),
		publishedAt: _stringOrFallback(article.publishedAt ?? article['date']),
		readTime: _stringOrFallback(article.readTime, '3 min read'),
		body: _stringsOrFallback(article.body, [summary]),
		highlights: _stringsOrFallback(article.highlights, []),
	};
}

function _slugOrFallback(value: unknown, index: number): string {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return `article-${value}`;
	}

	const normalized = _stringOrFallback(value)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

	return normalized || `article-${index + 1}`;
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
