import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';

@Component({
	imports: [RouterLink, TranslateDirective],
	templateUrl: './navigation.component.html',
	styleUrl: './navigation.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
	protected readonly navItems = [
		{ label: 'About us', icon: 'info', route: '/about' },
		{ label: 'FAQ', icon: 'help', route: '/questions' },
		{ label: 'Rules', icon: 'gavel', route: '/rules' },
		{ label: 'Discounts', icon: 'local_offer', route: '/discounts' },
		{ label: 'Reviews', icon: 'rate_review', route: '/reviews' },
		{ label: 'Events', icon: 'event', route: '/events' },
	];
}
