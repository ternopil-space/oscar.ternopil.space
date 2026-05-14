import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';

@Component({
	selector: 'app-image',
	imports: [NgOptimizedImage, RouterLink, TranslateDirective],
	templateUrl: './image.component.html',
	styleUrl: './image.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageComponent {
	readonly src = input.required<string>();
	readonly alt = input('');
	readonly mode = input<'fullscreen' | 'navigate'>('fullscreen');
	readonly link = input<string | unknown[] | null>(null);
	readonly imageClass = input('');
	readonly buttonClass = input('');
	readonly fullscreenImageClass = input('max-h-full max-w-full rounded-[1rem] object-contain');
	readonly width = input(640);
	readonly height = input(480);
	readonly openLabel = input('Open image in full screen');
	readonly closeLabel = input('Close full screen image');
	readonly loading = input<'eager' | 'lazy'>('lazy');

	protected readonly isFullscreen = signal(false);
	protected readonly isNavigation = computed(() => this.mode() === 'navigate' && !!this.link());
	protected readonly thumbnailClass = computed(() =>
		['image-photo', this.imageClass()].filter(Boolean).join(' '),
	);
	protected readonly triggerClass = computed(() =>
		[
			'image-trigger block w-full',
			this.isNavigation() ? 'cursor-pointer' : 'cursor-zoom-in',
			this.buttonClass(),
		]
			.filter(Boolean)
			.join(' '),
	);
	protected readonly expandedImageClass = computed(() =>
		['fullscreen-photo', this.fullscreenImageClass()].filter(Boolean).join(' '),
	);
	protected readonly openAriaLabel = computed(() => {
		const alt = this.alt();

		if (this.isNavigation()) {
			return alt || this.openLabel();
		}

		return alt ? `${this.openLabel()}: ${alt}` : this.openLabel();
	});

	protected open() {
		this.isFullscreen.set(true);
	}

	protected close() {
		this.isFullscreen.set(false);
	}
}
