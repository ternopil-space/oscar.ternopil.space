import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { LanguageService, TranslateService } from '@wawjs/ngx-translate';
import profilesData from '../../../data/profiles.json';
import { Profile } from './profile.interface';

type RawProfile = Partial<Profile> & Record<string, unknown>;

const PROFILE_TRANSLATION_PATH = '/i18n/profile';
const _fallbackProfiles: Profile[] = _normalizeProfiles(profilesData as RawProfile[]);
const _fallbackProfileBySlug = new Map(_fallbackProfiles.map((profile) => [profile.slug, profile]));

export const profileSlugs = _fallbackProfiles.map((profile) => profile.slug);

export function findFallbackProfileBySlug(slug: string) {
	return _fallbackProfileBySlug.get(slug) ?? _fallbackProfiles[0] ?? null;
}

@Injectable({
	providedIn: 'root',
})
export class ProfileService {
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _languageService = inject(LanguageService);
	private readonly _translateService = inject(TranslateService);

	readonly profiles = signal<Profile[]>(_fallbackProfiles);

	loadTranslations() {
		if (!this._isBrowser) {
			return;
		}

		const language = this._languageService.language();

		void this._translateService.loadExtraTranslation(PROFILE_TRANSLATION_PATH, {
			language,
		});
	}

	setProfiles(profiles: RawProfile[] | null | undefined) {
		if (!Array.isArray(profiles) || profiles.length === 0) {
			this.profiles.set(_fallbackProfiles);
			return;
		}

		this.profiles.set(_normalizeProfiles(profiles));
	}
}

function _normalizeProfiles(profiles: RawProfile[]): Profile[] {
	return profiles
		.map((profile, index) => _normalizeProfile(profile, index))
		.filter((profile): profile is Profile => Boolean(profile));
}

function _normalizeProfile(profile: RawProfile, index: number): Profile | null {
	const name = _stringOrFallback(profile.name ?? profile['title']);
	const role = _stringOrFallback(profile.role ?? profile['position']);
	const description = _stringOrFallback(profile.description ?? profile['summary']);

	if (!name || !role || !description) {
		return null;
	}

	const slugSource = profile.slug ?? profile['id'] ?? name;

	return {
		slug: _slugOrFallback(slugSource, index),
		name,
		role,
		seniority: _stringOrFallback(profile.seniority ?? profile['experience']),
		description,
		image: _stringOrFallback(profile.image),
		tips: _stringOrFallback(profile.tips ?? profile['quote']),
		body: _stringsOrFallback(profile.body, [description]),
		highlights: _stringsOrFallback(profile.highlights, []),
	};
}

function _slugOrFallback(value: unknown, index: number): string {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return `profile-${value}`;
	}

	const normalized = _stringOrFallback(value)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

	return normalized || `profile-${index + 1}`;
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
