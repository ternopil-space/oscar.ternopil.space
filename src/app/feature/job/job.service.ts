import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { LanguageService, TranslateService } from '@wawjs/ngx-translate';
import jobsData from '../../../data/jobs.json';
import { Job } from './job.interface';

type RawJob = Partial<Job> & Record<string, unknown>;

const JOB_TRANSLATION_PATH = '/i18n/job';
const _fallbackJobs: Job[] = _normalizeJobs(jobsData as RawJob[]);
const _fallbackJobBySlug = new Map(_fallbackJobs.map((job) => [job.slug, job]));

export const jobSlugs = _fallbackJobs.map((job) => job.slug);

export function findFallbackJobBySlug(slug: string) {
	return _fallbackJobBySlug.get(slug) ?? _fallbackJobs[0] ?? null;
}

@Injectable({
	providedIn: 'root',
})
export class JobService {
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _languageService = inject(LanguageService);
	private readonly _translateService = inject(TranslateService);

	readonly jobs = signal<Job[]>(_fallbackJobs);
	readonly isLoading = signal(true);

	loadTranslations() {
		if (!this._isBrowser) {
			return;
		}

		const language = this._languageService.language();

		void this._translateService.loadExtraTranslation(JOB_TRANSLATION_PATH, {
			language,
		});
	}

	resolveJobs(jobs: RawJob[] | null | undefined) {
		this.jobs.set(
			Array.isArray(jobs) && jobs.length > 0 ? _normalizeJobs(jobs) : _fallbackJobs,
		);
		this.isLoading.set(false);
	}

	finishLoading() {
		this.isLoading.set(false);
	}
}

function _normalizeJobs(jobs: RawJob[]): Job[] {
	return jobs
		.map((job, index) => _normalizeJob(job, index))
		.filter((job): job is Job => Boolean(job));
}

function _normalizeJob(job: RawJob, index: number): Job | null {
	const title = _stringOrFallback(job.title ?? job['name'] ?? job['position']);
	const summary = _stringOrFallback(job.summary ?? job['description']);

	if (!title || !summary) {
		return null;
	}

	const slugSource = job.slug ?? job['id'] ?? title;

	return {
		slug: _slugOrFallback(slugSource, index),
		title,
		summary,
		department: _stringOrFallback(job.department),
		location: _stringOrFallback(job.location ?? job['city']),
		employmentType: _stringOrFallback(
			job.employmentType ?? job['type'] ?? job['format'],
		),
		schedule: _stringOrFallback(job.schedule),
		salary: _stringOrFallback(job.salary ?? job['salaryRange']),
		experience: _stringOrFallback(job.experience ?? job['experienceLevel']),
		level: _stringOrFallback(job.level),
		workFormat: _stringOrFallback(job.workFormat),
		applyUrl: _stringOrFallback(job.applyUrl ?? job['url']),
		applyLabel: _stringOrFallback(job.applyLabel),
		contactEmail: _stringOrFallback(job.contactEmail ?? job['email']),
		contactPhone: _stringOrFallback(job.contactPhone ?? job['phone']),
		body: _stringsOrFallback(job.body, [summary]),
		responsibilities: _stringsOrFallback(job.responsibilities, []),
		requirements: _stringsOrFallback(job.requirements, []),
		benefits: _stringsOrFallback(job.benefits, []),
		highlights: _stringsOrFallback(job.highlights, []),
	};
}

function _slugOrFallback(value: unknown, index: number): string {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return `job-${value}`;
	}

	const normalized = _stringOrFallback(value)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

	return normalized || `job-${index + 1}`;
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
