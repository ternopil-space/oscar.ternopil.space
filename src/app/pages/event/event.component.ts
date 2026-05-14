import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MetaService } from '@wawjs/ngx-core';
import { LanguageService, TranslateDirective, TranslateService } from '@wawjs/ngx-translate';
import { companyProfile } from '../../feature/company/company.data';
import type { EventItem } from '../../feature/event/event.interface';
import { EventService, findFallbackEventBySlug } from '../../feature/event/event.service';
import { CanonicalService } from '../../services/canonical.service';
import { buildAbsoluteUrl } from '../../services/seo.utils';

const _fallbackEvent = _resolveFallbackEvent();

@Component({
	imports: [RouterLink, TranslateDirective],
	templateUrl: './event.component.html',
	styleUrl: './event.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventComponent {
	private readonly _canonicalService = inject(CanonicalService);
	private readonly _eventService = inject(EventService);
	private readonly _languageService = inject(LanguageService);
	private readonly _metaService = inject(MetaService);
	private readonly _route = inject(ActivatedRoute);
	private readonly _title = inject(Title);
	private readonly _translateService = inject(TranslateService);
	private readonly _slug = toSignal(this._route.paramMap, {
		initialValue: this._route.snapshot.paramMap,
	});

	protected readonly event = computed(() => {
		const slug = this._slug().get('slug');
		const fromService = this._eventService.events().find((event) => event.slug === slug);

		return fromService ?? (slug ? findFallbackEventBySlug(slug) : null) ?? _fallbackEvent;
	});

	constructor() {
		effect(() => {
			this._eventService.loadTranslations();
		});

		effect(() => {
			this._languageService.language();
			const event = this.event();
			const translatedTitle = this._translateService.translate(event.title)();
			const translatedSummary = this._translateService.translate(event.summary)();

			this._title.setTitle(`${translatedTitle} | ${companyProfile.name}`);
			this._metaService.applyMeta({
				title: translatedTitle,
				description: translatedSummary,
				image: buildAbsoluteUrl(companyProfile.defaultSeo.image),
			});
			this._canonicalService.setCanonicalUrl(`/event/${event.slug}`);
		});
	}
}

function _resolveFallbackEvent(): EventItem {
	const event = findFallbackEventBySlug('');

	if (!event) {
		throw new Error('No events available in event data.');
	}

	return event;
}
