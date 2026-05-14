import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { LanguageService, TranslateService } from '@wawjs/ngx-translate';
import rulesData from '../../../data/rules.json';
import { Rule } from './rule.interface';

type RawRule = Partial<Rule> & Record<string, unknown>;

const RULE_TRANSLATION_PATH = '/i18n/rule';
const _fallbackRules: Rule[] = _normalizeRules(rulesData as RawRule[]);

@Injectable({
	providedIn: 'root',
})
export class RuleService {
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _languageService = inject(LanguageService);
	private readonly _translateService = inject(TranslateService);

	readonly rules = signal<Rule[]>(_fallbackRules);
	readonly isLoading = signal(true);

	loadTranslations() {
		if (!this._isBrowser) {
			return;
		}

		const language = this._languageService.language();

		void this._translateService.loadExtraTranslation(RULE_TRANSLATION_PATH, {
			language,
		});
	}

	resolveRules(rules: RawRule[] | null | undefined) {
		this.rules.set(
			Array.isArray(rules) && rules.length > 0 ? _normalizeRules(rules) : _fallbackRules,
		);
		this.isLoading.set(false);
	}

	finishLoading() {
		this.isLoading.set(false);
	}
}

function _normalizeRules(rules: RawRule[]): Rule[] {
	return rules.map((rule) => _normalizeRule(rule)).filter((rule): rule is Rule => Boolean(rule));
}

function _normalizeRule(rule: RawRule): Rule | null {
	const category = _stringOrFallback(rule.category ?? rule['group'] ?? rule['type'], 'General');
	const title = _stringOrFallback(rule.title ?? rule['name'] ?? rule['label']);
	const description = _stringOrFallback(
		rule.description ?? rule['summary'] ?? rule['body'] ?? rule['content'],
	);

	if (!title || !description) {
		return null;
	}

	return {
		category,
		title,
		description,
	};
}

function _stringOrFallback(value: unknown, fallback = ''): string {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return String(value);
	}

	return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}
