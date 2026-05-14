import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MetaService } from '@wawjs/ngx-core';
import { LanguageService, TranslateDirective, TranslateService } from '@wawjs/ngx-translate';
import { companyProfile } from '../../feature/company/company.data';
import type { Job } from '../../feature/job/job.interface';
import { JobService, findFallbackJobBySlug } from '../../feature/job/job.service';
import { CanonicalService } from '../../services/canonical.service';
import { buildAbsoluteUrl } from '../../services/seo.utils';

const _fallbackJob = _resolveFallbackJob();

interface JobInfoField {
	label: string;
	value: string;
}

@Component({
	imports: [RouterLink, TranslateDirective],
	templateUrl: './job.component.html',
	styleUrl: './job.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobComponent {
	private readonly _canonicalService = inject(CanonicalService);
	private readonly _jobService = inject(JobService);
	private readonly _languageService = inject(LanguageService);
	private readonly _metaService = inject(MetaService);
	private readonly _route = inject(ActivatedRoute);
	private readonly _title = inject(Title);
	private readonly _translateService = inject(TranslateService);
	private readonly _slug = toSignal(this._route.paramMap, {
		initialValue: this._route.snapshot.paramMap,
	});

	protected readonly job = computed(() => {
		const slug = this._slug().get('slug');
		const fromService = this._jobService.jobs().find((job) => job.slug === slug);

		return fromService ?? (slug ? findFallbackJobBySlug(slug) : null) ?? _fallbackJob;
	});
	protected readonly infoFields = computed<JobInfoField[]>(() => {
		const job = this.job();

		return [
			{ label: 'Department', value: job.department },
			{ label: 'Level', value: job.level },
			{ label: 'Work format', value: job.workFormat },
			{ label: 'Location', value: job.location },
			{ label: 'Employment type', value: job.employmentType },
			{ label: 'Schedule', value: job.schedule },
			{ label: 'Salary', value: job.salary },
			{ label: 'Experience', value: job.experience },
		].filter((field) => field.value.length > 0);
	});

	constructor() {
		effect(() => {
			this._jobService.loadTranslations();
		});

		effect(() => {
			this._languageService.language();
			const job = this.job();
			const translatedTitle = this._translateService.translate(job.title)();
			const translatedSummary = this._translateService.translate(job.summary)();

			this._title.setTitle(`${translatedTitle} | ${companyProfile.name}`);
			this._metaService.applyMeta({
				title: translatedTitle,
				description: translatedSummary,
				image: buildAbsoluteUrl(companyProfile.defaultSeo.image),
			});
			this._canonicalService.setCanonicalUrl(`/job/${job.slug}`);
		});
	}
}

function _resolveFallbackJob(): Job {
	const job = findFallbackJobBySlug('');

	if (!job) {
		throw new Error('No jobs available in job data.');
	}

	return job;
}
