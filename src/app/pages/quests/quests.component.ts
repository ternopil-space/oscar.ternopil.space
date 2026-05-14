import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { QuestService } from '../../feature/quest/quest.service';

@Component({
	imports: [RouterLink, TranslateDirective],
	templateUrl: './quests.component.html',
	styleUrl: './quests.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestsComponent {
	private readonly _questService = inject(QuestService);

	protected readonly quests = this._questService.quests;
	protected readonly isLoading = this._questService.isLoading;

	constructor() {
		effect(() => {
			this._questService.loadTranslations();
		});
	}
}
