import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MetaService } from '@wawjs/ngx-core';
import { LanguageService, TranslateDirective, TranslateService } from '@wawjs/ngx-translate';
import { companyProfile } from '../../feature/company/company.data';
import type { Profile } from '../../feature/profile/profile.interface';
import { ProfileService, findFallbackProfileBySlug } from '../../feature/profile/profile.service';
import { CanonicalService } from '../../services/canonical.service';
import { buildAbsoluteUrl } from '../../services/seo.utils';

const _fallbackProfile = _resolveFallbackProfile();

@Component({
	imports: [NgOptimizedImage, RouterLink, TranslateDirective],
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
	private readonly _canonicalService = inject(CanonicalService);
	private readonly _languageService = inject(LanguageService);
	private readonly _metaService = inject(MetaService);
	private readonly _profileService = inject(ProfileService);
	private readonly _route = inject(ActivatedRoute);
	private readonly _title = inject(Title);
	private readonly _translateService = inject(TranslateService);
	private readonly _slug = toSignal(this._route.paramMap, {
		initialValue: this._route.snapshot.paramMap,
	});

	protected readonly profile = computed(() => {
		const slug = this._slug().get('slug');
		const fromService = this._profileService
			.profiles()
			.find((profile) => profile.slug === slug);

		return fromService ?? (slug ? findFallbackProfileBySlug(slug) : null) ?? _fallbackProfile;
	});

	constructor() {
		effect(() => {
			this._profileService.loadTranslations();
		});

		effect(() => {
			this._languageService.language();
			const profile = this.profile();
			const translatedName = this._translateService.translate(profile.name)();
			const translatedDescription = this._translateService.translate(profile.description)();

			this._title.setTitle(`${translatedName} | ${companyProfile.name}`);
			this._metaService.applyMeta({
				title: translatedName,
				description: translatedDescription,
				image: buildAbsoluteUrl(profile.image || companyProfile.defaultSeo.image),
			});
			this._canonicalService.setCanonicalUrl(`/profile/${profile.slug}`);
		});
	}
}

function _resolveFallbackProfile(): Profile {
	const profile = findFallbackProfileBySlug('');

	if (!profile) {
		throw new Error('No profiles available in profile data.');
	}

	return profile;
}
