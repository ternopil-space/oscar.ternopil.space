import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService, TranslateDirective, TranslateService } from '@wawjs/ngx-translate';
import loyaltyData from '../../../data/loyalty.json';

interface LoyaltyStep {
	title: string;
	description: string;
}

interface LoyaltyLevel {
	name: string;
	description: string;
	benefits: string[];
}

interface LoyaltyPageData {
	hero: {
		title: string;
		subtitle: string;
		description: string;
	};
	howItWorks: {
		title: string;
		steps: LoyaltyStep[];
	};
	benefits: {
		title: string;
		items: string[];
	};
	earnRewards: {
		title: string;
		items: string[];
	};
	levels: {
		title: string;
		items: LoyaltyLevel[];
	};
	specialDates: {
		title: string;
		description: string;
		items: string[];
	};
	terms: {
		title: string;
		items: string[];
	};
	cta: {
		title: string;
		description: string;
		label: string;
		href: string;
	};
}

const LOYALTY_TRANSLATION_PATH = '/i18n/loyalty';
const BENEFIT_ICONS = ['cake', 'local_cafe', 'sell', 'hotel', 'spa', 'event', 'groups'];
const REWARD_ICONS = [
	'restaurant',
	'hotel',
	'local_cafe',
	'spa',
	'event_available',
	'group_add',
	'celebration',
];

@Component({
	imports: [RouterLink, TranslateDirective],
	templateUrl: './loyalty.component.html',
	styleUrl: './loyalty.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyComponent {
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _languageService = inject(LanguageService);
	private readonly _translateService = inject(TranslateService);

	protected readonly page = loyaltyData as LoyaltyPageData;

	constructor() {
		effect(() => {
			if (!this._isBrowser) {
				return;
			}

			const language = this._languageService.language();

			void this._translateService.loadExtraTranslation(LOYALTY_TRANSLATION_PATH, {
				language,
			});
		});
	}

	protected benefitIcon(index: number): string {
		return BENEFIT_ICONS[index] ?? 'workspace_premium';
	}

	protected rewardIcon(index: number): string {
		return REWARD_ICONS[index] ?? 'stars';
	}
}
