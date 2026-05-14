import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { QuestionService } from '../../feature/question/question.service';

@Component({
	imports: [TranslateDirective],
	templateUrl: './questions.component.html',
	styleUrl: './questions.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionsComponent {
	private readonly _questionService = inject(QuestionService);

	protected readonly questions = this._questionService.questions;
	protected readonly isLoading = this._questionService.isLoading;

	constructor() {
		effect(() => {
			this._questionService.loadTranslations();
		});
	}
}
