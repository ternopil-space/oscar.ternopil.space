import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MetaService } from '@wawjs/ngx-core';
import { LanguageService, TranslateDirective, TranslateService } from '@wawjs/ngx-translate';
import { companyProfile } from '../../feature/company/company.data';
import type { Quest } from '../../feature/quest/quest.interface';
import { QuestService, findFallbackQuestBySlug } from '../../feature/quest/quest.service';
import { CanonicalService } from '../../services/canonical.service';
import { buildAbsoluteUrl } from '../../services/seo.utils';

const _fallbackQuest = _resolveFallbackQuest();

@Component({
	imports: [RouterLink, TranslateDirective],
	templateUrl: './quest.component.html',
	styleUrl: './quest.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestComponent {
	private readonly _canonicalService = inject(CanonicalService);
	private readonly _languageService = inject(LanguageService);
	private readonly _metaService = inject(MetaService);
	private readonly _questService = inject(QuestService);
	private readonly _route = inject(ActivatedRoute);
	private readonly _title = inject(Title);
	private readonly _translateService = inject(TranslateService);
	private readonly _slug = toSignal(this._route.paramMap, {
		initialValue: this._route.snapshot.paramMap,
	});

	protected readonly quest = computed(() => {
		const slug = this._slug().get('slug');
		const fromService = this._questService.quests().find((quest) => quest.slug === slug);

		return fromService ?? (slug ? findFallbackQuestBySlug(slug) : null) ?? _fallbackQuest;
	});

	constructor() {
		effect(() => {
			this._questService.loadTranslations();
		});

		effect(() => {
			this._languageService.language();
			const quest = this.quest();
			const translatedTitle = this._translateService.translate(quest.title)();
			const translatedSummary = this._translateService.translate(quest.summary)();

			this._title.setTitle(`${translatedTitle} | ${companyProfile.name}`);
			this._metaService.applyMeta({
				title: translatedTitle,
				description: translatedSummary,
				image: buildAbsoluteUrl(companyProfile.defaultSeo.image),
			});
			this._canonicalService.setCanonicalUrl(`/quest/${quest.slug}`);
		});
	}
}

function _resolveFallbackQuest(): Quest {
	const quest = findFallbackQuestBySlug('');

	if (!quest) {
		throw new Error('No quests available in quest data.');
	}

	return quest;
}
