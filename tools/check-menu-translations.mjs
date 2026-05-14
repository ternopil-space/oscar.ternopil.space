import { readFile } from 'node:fs/promises';

const languages = ['ua', 'en', 'de', 'fr', 'pl'];
const dishes = JSON.parse(await readFile('src/data/dishes.json', 'utf8'));
const categories = JSON.parse(await readFile('src/data/dishCategories.json', 'utf8'));
const source = new Set();

for (const category of categories) {
	add(category.name);
	add(category.description);
}

for (const dish of dishes) {
	add(dish.name);
	add(dish.description);
	add(dish.fullDescription);

	for (const label of dish.labels ?? []) {
		add(label);
	}
}

for (const language of languages) {
	const translations = JSON.parse(await readFile(`src/i18n/dish/${language}.json`, 'utf8'));
	const missing = [...source].filter((value) => !translations[value]);

	console.log(
		language,
		Object.keys(translations).length,
		'missing',
		missing.length,
		'|',
		translations['Борщ з ребром'],
		'|',
		translations['БЕНКЕТНЕ МЕНЮ'],
		'|',
		translations['Сирники з сметаною'],
	);
}

function add(value) {
	const text = String(value || '').trim();

	if (text) {
		source.add(text);
	}
}
