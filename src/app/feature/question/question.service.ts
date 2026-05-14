import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { LanguageService, TranslateService } from '@wawjs/ngx-translate';
import questionsData from '../../../data/question.json';
import { Question } from './question.interface';

type RawQuestion = Partial<Question> & Record<string, unknown>;

const QUESTION_TRANSLATION_PATH = '/i18n/question';
const _fallbackQuestions: Question[] = _normalizeQuestions(questionsData as RawQuestion[]);

@Injectable({
	providedIn: 'root',
})
export class QuestionService {
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _languageService = inject(LanguageService);
	private readonly _translateService = inject(TranslateService);

	readonly questions = signal<Question[]>(_fallbackQuestions);
	readonly isLoading = signal(true);

	loadTranslations() {
		if (!this._isBrowser) {
			return;
		}

		const language = this._languageService.language();

		void this._translateService.loadExtraTranslation(QUESTION_TRANSLATION_PATH, {
			language,
		});
	}

	resolveQuestions(questions: RawQuestion[] | null | undefined) {
		this.questions.set(
			Array.isArray(questions) && questions.length > 0
				? _normalizeQuestions(questions)
				: _fallbackQuestions,
		);
		this.isLoading.set(false);
	}

	finishLoading() {
		this.isLoading.set(false);
	}
}

function _normalizeQuestions(questions: RawQuestion[]): Question[] {
	return questions
		.map((question) => _normalizeQuestion(question))
		.filter((question): question is Question => Boolean(question));
}

function _normalizeQuestion(question: RawQuestion): Question | null {
	const questionText = _stringOrFallback(
		question.question ?? question['title'] ?? question['name'] ?? question['label'],
	);
	const answer = _stringOrFallback(
		question.answer ?? question['body'] ?? question['description'] ?? question['content'],
	);

	if (!questionText || !answer) {
		return null;
	}

	return {
		question: questionText,
		answer,
	};
}

function _stringOrFallback(value: unknown, fallback = ''): string {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return String(value);
	}

	return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}
