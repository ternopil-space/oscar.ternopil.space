import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService, TranslateDirective, TranslateService } from '@wawjs/ngx-translate';
import spaData from '../../../data/spa.json';

interface SpaScheduleItem {
	label: string;
	price: string;
}

interface SpaSchedule {
	days: string;
	items: SpaScheduleItem[];
}

interface SpaService {
	slug: string;
	title: string;
	subtitle: string;
	description: string;
	features: string[];
	schedule: SpaSchedule[];
	note: string;
	images: string[];
}

interface SpaPageData {
	eyebrow: string;
	title: string;
	description: string;
	tags: string[];
	services: SpaService[];
	booking: {
		title: string;
		text: string;
	};
}

const SPA_TRANSLATION_PATH = '/i18n/spa';

@Component({
	imports: [NgOptimizedImage, RouterLink, TranslateDirective],
	templateUrl: './spa.component.html',
	styleUrl: './spa.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpaComponent {
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _languageService = inject(LanguageService);
	private readonly _translateService = inject(TranslateService);

	protected readonly page = spaData as SpaPageData;
	protected readonly unavailableImages = signal<ReadonlySet<string>>(new Set());

	constructor() {
		effect(() => {
			if (!this._isBrowser) {
				return;
			}

			const language = this._languageService.language();

			void this._translateService.loadExtraTranslation(SPA_TRANSLATION_PATH, {
				language,
			});
		});
	}

	protected imageSrc(path: string): string {
		return _assetPath(path);
	}

	protected isImageUnavailable(path: string): boolean {
		return this.unavailableImages().has(path);
	}

	protected markImageUnavailable(path: string) {
		this.unavailableImages.update((images) => new Set(images).add(path));
	}
}

function _assetPath(path: string): string {
	const normalized = path.trim().replace(/^\/+/, '');

	if (normalized.startsWith('assets/')) {
		return `/${normalized.replace(/^assets\//, '')}`;
	}

	return `/${normalized}`;
}
