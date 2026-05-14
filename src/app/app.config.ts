import {
	APP_INITIALIZER,
	ApplicationConfig,
	provideBrowserGlobalErrorListeners,
	provideZonelessChangeDetection,
} from '@angular/core';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideNgxCore } from '@wawjs/ngx-core';
import { provideTranslate } from '@wawjs/ngx-translate';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { BootstrapService } from './feature/bootstrap/bootstrap.service';
import { companyProfile } from './feature/company/company.data';
import { buildAbsoluteUrl, seoTitleSuffix, stripTitleSuffix } from './services/seo.utils';

const initializeBootstrapData = (bootstrapService: BootstrapService) => () =>
	bootstrapService.initialize();

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),
		provideRouter(
			routes,
			withRouterConfig({
				onSameUrlNavigation: 'reload',
			}),
		),
		provideHttpClient(withFetch()),
		provideClientHydration(withEventReplay()),
		provideNgxCore({
			meta: {
				applyFromRoutes: true,
				useTitleSuffix: true,
				defaults: {
					title: stripTitleSuffix(companyProfile.defaultSeo.title),
					titleSuffix: seoTitleSuffix,
					description: companyProfile.defaultSeo.description,
					image: buildAbsoluteUrl(companyProfile.defaultSeo.image),
					robots: companyProfile.defaultSeo.robots,
				},
			},
		}),
		provideTranslate({
			defaultLanguage: environment.defaultLanguage,
			languages: environment.languages,
			folder: '/i18n/interface/',
		}),
		{
			provide: APP_INITIALIZER,
			useFactory: initializeBootstrapData,
			deps: [BootstrapService],
			multi: true,
		},
	],
};
