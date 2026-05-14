import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const DISHES_PATH = path.join(ROOT_DIR, 'src', 'data', 'dishes.json');
const CATEGORIES_PATH = path.join(ROOT_DIR, 'src', 'data', 'dishCategories.json');
const DISH_I18N_DIR = path.join(ROOT_DIR, 'src', 'i18n', 'dish');
const TARGET_LANGUAGES = ['en', 'de', 'fr', 'pl'];

const args = parseArgs(process.argv.slice(2));
const sourceLanguage = args.source || 'uk';
const dishes = JSON.parse(await readFile(DISHES_PATH, 'utf8'));
const categories = JSON.parse(await readFile(CATEGORIES_PATH, 'utf8'));
const sourceStrings = collectMenuStrings(dishes, categories);
const commonStrings = await readCommonStrings();

await writeLanguageFile('ua', buildUkrainianTranslations(sourceStrings, commonStrings.ua));

for (const language of TARGET_LANGUAGES) {
	const sourceStringSet = new Set(sourceStrings);
	const existingTranslations = Object.fromEntries(
		Object.entries(await readExistingTranslations(language)).filter(
			([key]) => !sourceStringSet.has(key),
		),
	);
	const translations = { ...commonStrings[language], ...existingTranslations };
	const missingStrings = sourceStrings;

	if (missingStrings.length) {
		console.log(`Translating ${missingStrings.length} menu strings to ${language}...`);
		const translated = await translateStrings(missingStrings, sourceLanguage, language);
		Object.assign(translations, translated);
	}

	await writeLanguageFile(language, sortObject(translations));
}

console.log(
	`Menu translations updated for ua, ${TARGET_LANGUAGES.join(', ')} with ${sourceStrings.length} source strings.`,
);

function collectMenuStrings(menuDishes, menuCategories) {
	const values = new Set();

	for (const category of menuCategories) {
		addString(values, category.name);
		addString(values, category.description);
	}

	for (const dish of menuDishes) {
		addString(values, dish.name);
		addString(values, dish.description);
		addString(values, dish.fullDescription);

		for (const label of dish.labels ?? []) {
			addString(values, label);
		}

		for (const allergen of dish.allergens ?? []) {
			addString(values, allergen);
		}
	}

	return [...values];
}

function addString(values, value) {
	const text = cleanText(value);

	if (text) {
		values.add(text);
	}
}

async function readCommonStrings() {
	const result = {};

	for (const language of ['ua', ...TARGET_LANGUAGES]) {
		const translations = await readExistingTranslations(language);
		result[language] = Object.fromEntries(
			Object.entries(translations).filter(([key]) => !looksLikeCurrentMenuString(key)),
		);
	}

	return result;
}

async function readExistingTranslations(language) {
	try {
		return JSON.parse(await readFile(path.join(DISH_I18N_DIR, `${language}.json`), 'utf8'));
	} catch {
		return {};
	}
}

function buildUkrainianTranslations(sourceStrings, commonTranslations) {
	return sortObject({
		...commonTranslations,
		...Object.fromEntries(sourceStrings.map((value) => [value, value])),
	});
}

async function translateStrings(strings, source, target) {
	const result = {};
	const chunks = chunk(strings, 10);

	for (const values of chunks) {
		const translated = await Promise.all(
			values.map((sourceValue) => translateOne(sourceValue, source, target)),
		);

		for (const [sourceValue, translatedValue] of translated) {
			result[sourceValue] = restoreMenuFormatting(sourceValue, translatedValue, target);
		}
	}

	return result;
}

async function translateOne(value, source, target) {
	const url = new URL('https://translate.googleapis.com/translate_a/single');
	url.searchParams.set('client', 'gtx');
	url.searchParams.set('sl', source);
	url.searchParams.set('tl', target);
	url.searchParams.set('dt', 't');
	url.searchParams.set('q', prepareForTranslation(value));

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Translation failed for ${target}: ${response.status} ${response.statusText}`);
	}

	const data = await response.json();
	const translatedText = data?.[0]?.map((entry) => entry?.[0] ?? '').join('') || value;

	return [value, cleanText(translatedText)];
}

function prepareForTranslation(value) {
	return value.replace(/(\d+)\s?г\b/giu, '$1 g').replace(/(\d+)\s?мл\b/giu, '$1 ml');
}

function restoreMenuFormatting(sourceValue, translatedValue, target) {
	const prepared = prepareForTranslation(sourceValue);

	if (/^\d+(?:[.,]\d+)?\s?(?:г|g)$/iu.test(sourceValue)) {
		return prepared.replace(/\s+/g, ' ');
	}

	if (/^\d+(?:[.,]\d+)?\s?(?:мл|ml|л|l)$/iu.test(sourceValue)) {
		return prepared.replace(/\s+/g, ' ');
	}

	if (target === 'en') {
		return translatedValue.replace(/\bUAH\b/g, 'UAH');
	}

	return translatedValue;
}

function looksLikeCurrentMenuString(value) {
	return /[А-Яа-яІіЇїЄєҐґ]/u.test(value);
}

function cleanText(value) {
	return String(value || '').replace(/\s+/g, ' ').trim();
}

function chunk(values, size) {
	const chunks = [];

	for (let index = 0; index < values.length; index += size) {
		chunks.push(values.slice(index, index + size));
	}

	return chunks;
}

function sortObject(value) {
	return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)));
}

async function writeLanguageFile(language, translations) {
	await writeFile(
		path.join(DISH_I18N_DIR, `${language}.json`),
		`${JSON.stringify(translations, null, '\t')}\n`,
		'utf8',
	);
}

function parseArgs(argv) {
	const parsed = {};

	for (const arg of argv) {
		if (!arg.startsWith('--')) {
			continue;
		}

		const [key, value] = arg.slice(2).split('=');
		parsed[key] = value ?? true;
	}

	return parsed;
}
