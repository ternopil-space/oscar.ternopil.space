import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { LanguageService, TranslateService } from '@wawjs/ngx-translate';
import eventsData from '../../../data/events.json';
import { EventItem } from './event.interface';

type RawEvent = Partial<EventItem> & Record<string, unknown>;

const EVENT_TRANSLATION_PATH = '/i18n/event';
const _fallbackEvents: EventItem[] = _normalizeEvents(eventsData as RawEvent[]);
const _fallbackEventBySlug = new Map(_fallbackEvents.map((event) => [event.slug, event]));

export const eventSlugs = _fallbackEvents.map((event) => event.slug);

export function findFallbackEventBySlug(slug: string) {
	return _fallbackEventBySlug.get(slug) ?? _fallbackEvents[0] ?? null;
}

@Injectable({
	providedIn: 'root',
})
export class EventService {
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _languageService = inject(LanguageService);
	private readonly _translateService = inject(TranslateService);

	readonly events = signal<EventItem[]>(_fallbackEvents);
	readonly isLoading = signal(true);

	loadTranslations() {
		if (!this._isBrowser) {
			return;
		}

		const language = this._languageService.language();

		void this._translateService.loadExtraTranslation(EVENT_TRANSLATION_PATH, {
			language,
		});
	}

	resolveEvents(events: RawEvent[] | null | undefined) {
		this.events.set(
			Array.isArray(events) && events.length > 0 ? _normalizeEvents(events) : _fallbackEvents,
		);
		this.isLoading.set(false);
	}

	finishLoading() {
		this.isLoading.set(false);
	}
}

function _normalizeEvents(events: RawEvent[]): EventItem[] {
	return events
		.map((event, index) => _normalizeEvent(event, index))
		.filter((event): event is EventItem => Boolean(event));
}

function _normalizeEvent(event: RawEvent, index: number): EventItem | null {
	const title = _stringOrFallback(event.title ?? event['name'] ?? event['eventTitle']);
	const summary = _stringOrFallback(event.summary ?? event['description']);

	if (!title || !summary) {
		return null;
	}

	const slugSource = event.slug ?? event['id'] ?? title;

	return {
		slug: _slugOrFallback(slugSource, index),
		title,
		summary,
		dateLabel: _stringOrFallback(event.dateLabel ?? event['date']),
		timeLabel: _stringOrFallback(event.timeLabel ?? event['time']),
		location: _stringOrFallback(event.location ?? event['venue']),
		format: _stringOrFallback(event.format ?? event['type']),
		capacity: _stringOrFallback(event.capacity ?? event['guests']),
		ctaLabel: _stringOrFallback(event.ctaLabel ?? event['buttonLabel'] ?? event['linkText']),
		ctaHref: _stringOrFallback(event.ctaHref ?? event['url'] ?? event['link']),
		body: _stringsOrFallback(event.body, [summary]),
		highlights: _stringsOrFallback(event.highlights, []),
	};
}

function _slugOrFallback(value: unknown, index: number): string {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return `event-${value}`;
	}

	const normalized = _stringOrFallback(value)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

	return normalized || `event-${index + 1}`;
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
