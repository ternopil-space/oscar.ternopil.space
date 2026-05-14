import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { companyProfile } from '../../feature/company/company.data';

@Component({
	imports: [NgOptimizedImage, RouterLink, TranslateDirective],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
	protected readonly company = companyProfile;
	protected readonly horecaHighlights = [
		'Restaurant Oscar in Ternopil offers an exceptional blend of European and Ukrainian cuisine, crafted with seasonal local ingredients.',
		'Browse the menu, book a table, read reviews, and find contact details - all in one place.',
		'Enjoy a modern interior, live music evenings, seasonal terrace, and attentive service that makes every visit special.',
	];
}
