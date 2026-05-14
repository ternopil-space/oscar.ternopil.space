import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { LanguageService, TranslateService } from '@wawjs/ngx-translate';
import questsData from '../../../data/quests.json';
import { Quest } from './quest.interface';

type RawQuest = Partial<Quest> & Record<string, unknown>;

const QUEST_TRANSLATION_PATH = '/i18n/quest';
const _fallbackQuests: Quest[] = _normalizeQuests(questsData as RawQuest[]);
const _fallbackQuestBySlug = new Map(_fallbackQuests.map((quest) => [quest.slug, quest]));

export const questSlugs = _fallbackQuests.map((quest) => quest.slug);

export function findFallbackQuestBySlug(slug: string) {
	return _fallbackQuestBySlug.get(slug) ?? _fallbackQuests[0] ?? null;
}

@Injectable({
	providedIn: 'root',
})
export class QuestService {
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _languageService = inject(LanguageService);
	private readonly _translateService = inject(TranslateService);

	readonly quests = signal<Quest[]>(_fallbackQuests);
	readonly isLoading = signal(true);

	loadTranslations() {
		if (!this._isBrowser) {
			return;
		}

		const language = this._languageService.language();

		void this._translateService.loadExtraTranslation(QUEST_TRANSLATION_PATH, {
			language,
		});
	}

	resolveQuests(quests: RawQuest[] | null | undefined) {
		this.quests.set(
			Array.isArray(quests) && quests.length > 0 ? _normalizeQuests(quests) : _fallbackQuests,
		);
		this.isLoading.set(false);
	}

	finishLoading() {
		this.isLoading.set(false);
	}
}

function _normalizeQuests(quests: RawQuest[]): Quest[] {
	return quests
		.map((quest, index) => _normalizeQuest(quest, index))
		.filter((quest): quest is Quest => Boolean(quest));
}

function _normalizeQuest(quest: RawQuest, index: number): Quest | null {
	const title = _stringOrFallback(
		quest.title ?? quest['name'] ?? quest['questTitle'] ?? quest['label'],
	);

	if (!title) {
		return null;
	}

	const slugSource = quest.slug ?? quest['id'] ?? title;

	return {
		slug: _slugOrFallback(slugSource, index),
		title,
		summary: _stringOrFallback(quest.summary ?? quest['description'] ?? quest['details']),
		duration: _stringOrFallback(quest.duration ?? quest['time'] ?? quest['durationLabel']),
		format: _stringOrFallback(quest.format ?? quest['type'] ?? quest['category']),
		price: _stringOrFallback(quest.price ?? quest['priceLabel'] ?? quest['cost']),
		ctaLabel: _stringOrFallback(
			quest.ctaLabel ?? quest['buttonLabel'] ?? quest['linkText'],
		),
		ctaHref: _stringOrFallback(quest.ctaHref ?? quest['url'] ?? quest['link']),
		body: _stringsOrFallback(quest.body, [
			_stringOrFallback(quest.summary ?? quest['description'] ?? quest['details']),
		]),
		highlights: _stringsOrFallback(quest.highlights, []),
	};
}

function _slugOrFallback(value: unknown, index: number): string {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return `quest-${value}`;
	}

	const normalized = _stringOrFallback(value)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

	return normalized || `quest-${index + 1}`;
}

function _stringOrFallback(value: unknown, fallback = ''): string {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return String(value);
	}

	return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}

function _stringsOrFallback(value: unknown, fallback: string[]): string[] {
	if (!Array.isArray(value)) {
		return fallback.filter((item) => item.length > 0);
	}

	const strings = value
		.map((item) => _stringOrFallback(item))
		.filter((item) => item.length > 0);

	return strings.length ? strings : fallback.filter((item) => item.length > 0);
}
