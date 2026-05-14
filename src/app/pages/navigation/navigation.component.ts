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
		{ label: 'Products', icon: 'shopping_bag', route: '/products' },

		{ label: 'FAQ', icon: 'help', route: '/questions' },
		{ label: 'Rules', icon: 'gavel', route: '/rules' },

		{ label: 'Rooms', icon: 'hotel', route: '/rooms' },
		{ label: 'Discounts', icon: 'local_offer', route: '/discounts' },

		{ label: 'Team', icon: 'group', route: '/team' },
		{ label: 'Jobs', icon: 'work', route: '/jobs' },

		{ label: 'Articles', icon: 'article', route: '/articles' },
		{ label: 'Reviews', icon: 'rate_review', route: '/reviews' },

		{ label: 'Events', icon: 'event', route: '/events' },
		{ label: 'Quests', icon: 'map', route: '/quests' },

		{ label: 'Spa', icon: 'spa', route: '/spa' },
		{ label: 'Loyalty', icon: 'workspace_premium', route: '/loyalty' },
	];
}
