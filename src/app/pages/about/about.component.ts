import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { LanguageService, TranslateDirective, TranslateService } from '@wawjs/ngx-translate';
import aboutData from '../../../data/about.json';

interface AboutIntro {
	title: string;
	text: string;
	image: string;
}

interface AboutSection {
	icon: string;
	title: string;
	items: string[];
}

interface AboutPageData {
	eyebrow: string;
	title: string;
	description: string;
	tags: string[];
	intro: AboutIntro;
	sections: AboutSection[];
	service: {
		title: string;
		text: string;
	};
}

const ABOUT_TRANSLATION_PATH = '/i18n/about';

@Component({
	imports: [NgOptimizedImage, TranslateDirective],
	templateUrl: './about.component.html',
	styleUrl: './about.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _languageService = inject(LanguageService);
	private readonly _translateService = inject(TranslateService);

	protected readonly page = aboutData as AboutPageData;
	protected readonly imageUnavailable = signal(false);
	protected readonly introImageSrc = _assetPath(this.page.intro.image);

	constructor() {
		effect(() => {
			if (!this._isBrowser) {
				return;
			}

			const language = this._languageService.language();

			void this._translateService.loadExtraTranslation(ABOUT_TRANSLATION_PATH, {
				language,
			});
		});
	}

	protected markIntroImageUnavailable() {
		this.imageUnavailable.set(true);
	}
}

function _assetPath(path: string): string {
	const normalized = path.trim().replace(/^\/+/, '');

	if (normalized.startsWith('assets/')) {
		return `/${normalized.replace(/^assets\//, '')}`;
	}

	return `/${normalized}`;
}
