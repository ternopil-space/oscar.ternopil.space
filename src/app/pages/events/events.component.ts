import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventService } from '../../feature/event/event.service';
import { TranslateDirective } from '@wawjs/ngx-translate';

@Component({
	imports: [RouterLink, TranslateDirective],
	templateUrl: './events.component.html',
	styleUrl: './events.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent {
	private readonly _eventService = inject(EventService);

	protected readonly events = this._eventService.events;
	protected readonly isLoading = this._eventService.isLoading;

	constructor() {
		effect(() => {
			this._eventService.loadTranslations();
		});
	}
}
