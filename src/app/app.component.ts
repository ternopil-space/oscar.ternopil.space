import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LanguageService, TranslateDirective, TranslateService } from '@wawjs/ngx-translate';
import { filter } from 'rxjs';
import { environment } from '../environments/environment';
import { companyProfile } from './feature/company/company.data';
import { TopbarComponent } from './layouts/topbar/topbar.component';
import { CanonicalService } from './services/canonical.service';
import { ScrollService } from './services/scroll.service';

@Component({
	selector: 'app-root',
	imports: [RouterLink, RouterLinkActive, RouterOutlet, TopbarComponent, TranslateDirective],
	templateUrl: './app.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
	private readonly _canonicalService = inject(CanonicalService);
	private readonly _document = inject(DOCUMENT);
	private readonly _languageService = inject(LanguageService);
	private readonly _router = inject(Router);
	private readonly _scrollService = inject(ScrollService);
	private readonly _title = inject(Title);
	private readonly _translateService = inject(TranslateService);
	private readonly _navigationEnd = toSignal(
		this._router.events.pipe(filter((event) => event instanceof NavigationEnd)),
		{ initialValue: null },
	);

	protected readonly navItems = [
		{ label: 'Nav', icon: 'navigation', route: '/navigation', exact: true },
		{ label: 'Gallery', icon: 'photo_library', route: '/gallery', exact: true },
		{ label: 'Socials', icon: 'share', route: '/socials', exact: true },
		{ label: 'Favorite', icon: 'favorite', route: '/favorites', exact: true },
		{ label: 'Menu', icon: 'restaurant_menu', route: '/menu', exact: true },
	];

	constructor() {
		this._canonicalService.initialize();
		this._scrollService.initialize();

		effect(() => {
			const language = this._languageService.language();
			const htmlLang =
				environment.languages.find((item) => item.code === language)?.htmlLang ?? language;

			if (htmlLang) {
				this._document.documentElement.lang = htmlLang;
			}
		});

		effect(() => {
			this._navigationEnd();
			this._languageService.language();

			const path = _normalizeTitlePath(this._router.url);

			if (
				path.startsWith('/dish/') ||
				path.startsWith('/discount/') ||
				path.startsWith('/review/') ||
				path.startsWith('/room/')
			) {
				return;
			}

			const titleKey = _pageTitleKeys[path];
			const translatedTitle = titleKey
				? this._translateService.translate(titleKey)()
				: companyProfile.name;

			this._title.setTitle(
				translatedTitle === companyProfile.name
					? translatedTitle
					: `${translatedTitle} | ${companyProfile.name}`,
			);
		});
	}
}

const _pageTitleKeys: Record<string, string> = {
	'/': 'Oscar',
	'/menu': 'Menu',
	'/about': 'About us',
	'/spa': 'Spa',
	'/favorites': 'Favorites',
	'/rooms': 'Rooms',
	'/navigation': 'Navigation',
	'/gallery': 'Gallery',
	'/discounts': 'Discounts',
	'/articles': 'Articles',
	'/quests': 'Quests',
	'/reviews': 'Reviews',
	'/events': 'Events',
	'/products': 'Products',
	'/jobs': 'Jobs',
	'/team': 'Team',
	'/socials': 'Socials',
};

function _normalizeTitlePath(url: string): string {
	return (url.split(/[?#]/)[0] || '/').replace(/\/+$/, '') || '/';
}
