import { RenderMode, ServerRoute } from '@angular/ssr';
import { articleSlugs } from './feature/article/article.service';
import { discountSlugs } from './feature/discount/discount.service';
import { dishSlugs } from './feature/dish/dish.data';
import { eventSlugs } from './feature/event/event.service';
import { jobSlugs } from './feature/job/job.service';
import { roomSlugs } from './feature/room/room.service';
import { profileSlugs } from './feature/profile/profile.service';
import { reviewSlugs } from './feature/review/review.service';
import { questSlugs } from './feature/quest/quest.service';
import { productSlugs } from './feature/product/product.service';

export const serverRoutes: ServerRoute[] = [
	{
		path: 'article/:slug',
		renderMode: RenderMode.Prerender,
		async getPrerenderParams() {
			return articleSlugs.map((slug) => ({ slug }));
		},
	},
	{
		path: 'dish/:slug',
		renderMode: RenderMode.Prerender,
		async getPrerenderParams() {
			return dishSlugs.map((slug) => ({ slug }));
		},
	},
	{
		path: 'discount/:slug',
		renderMode: RenderMode.Prerender,
		async getPrerenderParams() {
			return discountSlugs.map((slug) => ({ slug }));
		},
	},
	{
		path: 'event/:slug',
		renderMode: RenderMode.Prerender,
		async getPrerenderParams() {
			return eventSlugs.map((slug) => ({ slug }));
		},
	},
	{
		path: 'job/:slug',
		renderMode: RenderMode.Prerender,
		async getPrerenderParams() {
			return jobSlugs.map((slug) => ({ slug }));
		},
	},
	{
		path: 'room/:slug',
		renderMode: RenderMode.Prerender,
		async getPrerenderParams() {
			return roomSlugs.map((slug) => ({ slug }));
		},
	},
	{
		path: 'profile/:slug',
		renderMode: RenderMode.Prerender,
		async getPrerenderParams() {
			return profileSlugs.map((slug) => ({ slug }));
		},
	},
	{
		path: 'review/:slug',
		renderMode: RenderMode.Prerender,
		async getPrerenderParams() {
			return reviewSlugs.map((slug) => ({ slug }));
		},
	},
	{
		path: 'quest/:slug',
		renderMode: RenderMode.Prerender,
		async getPrerenderParams() {
			return questSlugs.map((slug) => ({ slug }));
		},
	},
	{
		path: 'product/:slug',
		renderMode: RenderMode.Prerender,
		async getPrerenderParams() {
			return productSlugs.map((slug) => ({ slug }));
		},
	},
	{
		path: '**',
		renderMode: RenderMode.Prerender,
	},
];
