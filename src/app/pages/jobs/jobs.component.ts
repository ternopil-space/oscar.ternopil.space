import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { JobService } from '../../feature/job/job.service';

@Component({
	imports: [RouterLink, TranslateDirective],
	templateUrl: './jobs.component.html',
	styleUrl: './jobs.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsComponent {
	private readonly _jobService = inject(JobService);

	protected readonly jobs = this._jobService.jobs;
	protected readonly isLoading = this._jobService.isLoading;

	constructor() {
		effect(() => {
			this._jobService.loadTranslations();
		});
	}
}
