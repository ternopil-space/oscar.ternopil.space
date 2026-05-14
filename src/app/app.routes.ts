import { Routes } from '@angular/router';
import { buildRouteMeta } from './services/seo.utils';

export const routes: Routes = [
	{
		path: '',
		data: {
			meta: buildRouteMeta('/'),
		},
		loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
	},
	{
		path: 'menu',
		data: {
			meta: buildRouteMeta('/menu'),
		},
		loadComponent: () => import('./pages/menu/menu.component').then((m) => m.MenuComponent),
	},
	{
		path: 'about',
		data: {
			meta: buildRouteMeta('/about'),
		},
		loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent),
	},
	{
		path: 'spa',
		data: {
			meta: buildRouteMeta('/spa'),
		},
		loadComponent: () => import('./pages/spa/spa.component').then((m) => m.SpaComponent),
	},
	{
		path: 'favorites',
		data: {
			meta: buildRouteMeta('/favorites'),
		},
		loadComponent: () => import('./pages/menu/menu.component').then((m) => m.MenuComponent),
	},
	{
		path: 'rooms',
		data: {
			meta: buildRouteMeta('/rooms'),
		},
		loadComponent: () => import('./pages/rooms/rooms.component').then((m) => m.RoomsComponent),
	},
	{
		path: 'navigation',
		data: {
			meta: buildRouteMeta('/navigation'),
		},
		loadComponent: () =>
			import('./pages/navigation/navigation.component').then((m) => m.NavigationComponent),
	},
	{
		path: 'gallery',
		data: {
			meta: buildRouteMeta('/gallery'),
		},
		loadComponent: () =>
			import('./pages/gallery/gallery.component').then((m) => m.GalleryComponent),
	},
	{
		path: 'dish/:slug',
		loadComponent: () => import('./pages/dish/dish.component').then((m) => m.DishComponent),
	},
	{
		path: 'room/:slug',
		loadComponent: () => import('./pages/room/room.component').then((m) => m.RoomComponent),
	},
	{
		path: 'discounts',
		data: {
			meta: buildRouteMeta('/discounts'),
		},
		loadComponent: () =>
			import('./pages/discounts/discounts.component').then((m) => m.DiscountsComponent),
	},
	{
		path: 'discount/:slug',
		loadComponent: () =>
			import('./pages/discount/discount.component').then((m) => m.DiscountComponent),
	},
	{
		path: 'loyalty',
		data: {
			meta: buildRouteMeta('/loyalty'),
		},
		loadComponent: () =>
			import('./pages/loyalty/loyalty.component').then((m) => m.LoyaltyComponent),
	},
	{
		path: 'articles',
		data: {
			meta: buildRouteMeta('/articles'),
		},
		loadComponent: () =>
			import('./pages/articles/articles.component').then((m) => m.ArticlesComponent),
	},
	{
		path: 'article/:slug',
		loadComponent: () =>
			import('./pages/article/article.component').then((m) => m.ArticleComponent),
	},
	{
		path: 'quests',
		data: {
			meta: buildRouteMeta('/quests'),
		},
		loadComponent: () =>
			import('./pages/quests/quests.component').then((m) => m.QuestsComponent),
	},
	{
		path: 'questions',
		data: {
			meta: buildRouteMeta('/questions'),
		},
		loadComponent: () =>
			import('./pages/questions/questions.component').then((m) => m.QuestionsComponent),
	},
	{
		path: 'rules',
		data: {
			meta: buildRouteMeta('/rules'),
		},
		loadComponent: () => import('./pages/rules/rules.component').then((m) => m.RulesComponent),
	},
	{
		path: 'quest/:slug',
		loadComponent: () => import('./pages/quest/quest.component').then((m) => m.QuestComponent),
	},
	{
		path: 'reviews',
		data: {
			meta: buildRouteMeta('/reviews'),
		},
		loadComponent: () =>
			import('./pages/reviews/reviews.component').then((m) => m.ReviewsComponent),
	},
	{
		path: 'review/:slug',
		loadComponent: () =>
			import('./pages/review/review.component').then((m) => m.ReviewComponent),
	},
	{
		path: 'events',
		data: {
			meta: buildRouteMeta('/events'),
		},
		loadComponent: () =>
			import('./pages/events/events.component').then((m) => m.EventsComponent),
	},
	{
		path: 'event/:slug',
		loadComponent: () => import('./pages/event/event.component').then((m) => m.EventComponent),
	},
	{
		path: 'products',
		data: {
			meta: buildRouteMeta('/products'),
		},
		loadComponent: () =>
			import('./pages/products/products.component').then((m) => m.ProductsComponent),
	},
	{
		path: 'product/:slug',
		loadComponent: () =>
			import('./pages/product/product.component').then((m) => m.ProductComponent),
	},
	{
		path: 'jobs',
		data: {
			meta: buildRouteMeta('/jobs'),
		},
		loadComponent: () => import('./pages/jobs/jobs.component').then((m) => m.JobsComponent),
	},
	{
		path: 'job/:slug',
		loadComponent: () => import('./pages/job/job.component').then((m) => m.JobComponent),
	},
	{
		path: 'team',
		data: {
			meta: buildRouteMeta('/team'),
		},
		loadComponent: () => import('./pages/team/team.component').then((m) => m.TeamComponent),
	},
	{
		path: 'profile/:slug',
		loadComponent: () =>
			import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
	},
	{
		path: 'socials',
		data: {
			meta: buildRouteMeta('/socials'),
		},
		loadComponent: () =>
			import('./pages/socials/socials.component').then((m) => m.SocialsComponent),
	},
	{
		path: '**',
		redirectTo: '/',
	},
];
