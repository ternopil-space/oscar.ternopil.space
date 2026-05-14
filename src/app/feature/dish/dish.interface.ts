export interface DishCategory {
	children?: DishCategory[]; // virtual field
	name: string;
	description: string;
	parent: string;
	slug: string;
}

export interface Dish {
	slug: string;
	categorySlug: string;
	name: string;
	description: string | null;
	price: number | null;
	currency: string;
	image: string;
	labels: string[];
	fullDescription: string | null;
	suggested: string[];
	cookTimeMinutes: number | null;
	caloriesKcal: number | null;
	portion: string | null;
	allergens: string[];
}

export interface DishCard {
	id: string;
	slug: string;
	name: string;
	price: number | null;
	description: string | null;
	currency: string;
	labels: string[];
	image: string;
	imageAlt: string;
	soldOut: boolean;
}
