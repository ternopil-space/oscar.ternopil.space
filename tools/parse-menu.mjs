import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MENU_PARSER_SELECTORS as S } from './menu-parser.config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const DEFAULT_DISHES_PATH = path.join(ROOT_DIR, 'src', 'data', 'dishes.json');
const DEFAULT_CATEGORIES_PATH = path.join(ROOT_DIR, 'src', 'data', 'dishCategories.json');
const DEFAULT_IMAGE_DIR = path.join(ROOT_DIR, 'src', 'assets', 'item');
const DEFAULT_DEBUG_HTML_PATH = path.join(ROOT_DIR, 'debug-choiceqr.html');
const DEFAULT_DEBUG_SCREENSHOT_PATH = path.join(ROOT_DIR, 'debug-choiceqr.png');
const CHOICEQR_EXTRA_SECTIONS = ['БАР', 'ДЕСЕРТИ', 'БЕНКЕТНЕ МЕНЮ'];

const args = parseArgs(process.argv.slice(2));
const sourceUrl = args.url || process.env.MENU_SOURCE_URL || args._[0];
const renderMode = args.render || 'auto';
const shouldDownloadImages = args.images !== 'false' && !args.noImages;
const shouldSaveDebug = args.debug !== 'false' && renderMode === 'js';

if (!sourceUrl || sourceUrl === '[ВСТАВ URL]') {
	throw new Error('Provide a source URL: npm run parse:menu -- --url=https://example.com/menu');
}

const html = await readHtml(sourceUrl, renderMode);
const parsed = await parseHtml(html, sourceUrl);

if (parsed.dishes.length === 0 && renderMode === 'auto') {
	const jsHtml = await readHtml(sourceUrl, 'js');
	const jsParsed = await parseHtml(jsHtml, sourceUrl);

	if (jsParsed.dishes.length > parsed.dishes.length) {
		parsed.categories = jsParsed.categories;
		parsed.dishes = jsParsed.dishes;
	}
}

if (shouldDownloadImages) {
	await saveImages(parsed.dishes);
}

await writeJson(args.outDishes || DEFAULT_DISHES_PATH, parsed.dishes);
await writeJson(args.outCategories || DEFAULT_CATEGORIES_PATH, parsed.categories);

console.log(
	`Parsed ${parsed.dishes.length} dishes in ${parsed.categories.length} categories from ${sourceUrl}`,
);

async function readHtml(url, mode) {
	if (mode === 'js') {
		return readRenderedHtml(url);
	}

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
	}

	return response.text();
}

async function readRenderedHtml(url) {
	let chromium;

	try {
		({ chromium } = await import('playwright'));
	} catch {
		throw new Error('Playwright is required for JS-rendered menus. Run: npm install');
	}

	const browser = await chromium.launch();
	const page = await browser.newPage({ viewport: { width: 1440, height: 1800 } });
	const htmlParts = [];

	await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
	await waitForMenu(page);
	htmlParts.push(await page.content());

	for (const sectionName of CHOICEQR_EXTRA_SECTIONS) {
		const clicked = await clickChoiceQrSection(page, sectionName);

		if (!clicked) {
			console.log(`ChoiceQR section not found: ${sectionName}`);
			continue;
		}

		await waitForMenu(page);
		htmlParts.push(await page.content());
	}

	if (shouldSaveDebug) {
		await writeFile(DEFAULT_DEBUG_HTML_PATH, htmlParts.join('\n<!-- next choiceqr section -->\n'), 'utf8');
		await page.screenshot({ path: DEFAULT_DEBUG_SCREENSHOT_PATH, fullPage: true });
	}

	await browser.close();

	return `<html><body>${htmlParts.join('\n<!-- next choiceqr section -->\n')}</body></html>`;
}

async function waitForMenu(page) {
	await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
	await page.waitForSelector(S.dish.join(','), { timeout: 30000 }).catch(() => {});
	await page.waitForTimeout(1500);
}

async function clickChoiceQrSection(page, sectionName) {
	const items = page.locator(S.sectionNav.join(','));
	const count = await items.count();

	for (let index = 0; index < count; index += 1) {
		const item = items.nth(index);
		const text = cleanText(await item.innerText().catch(() => ''));

		if (text.startsWith(sectionName)) {
			await item.click();
			return true;
		}
	}

	return false;
}

async function parseHtml(html, baseUrl) {
	let load;

	try {
		({ load } = await import('cheerio'));
	} catch {
		throw new Error('Cheerio is required for menu parsing. Run: npm install');
	}

	const $ = load(html);
	const categories = new Map();
	const dishes = new Map();
	const sectionElements = $(S.section.join(',')).toArray();

	logParseDiagnostics($);

	if (sectionElements.length) {
		for (const sectionElement of sectionElements) {
			parseChoiceQrSection($, $(sectionElement), baseUrl, categories, dishes);
		}
	} else {
		parseFlatCategories($, baseUrl, categories, dishes);
	}

	if (dishes.size === 0) {
		const jsonLdData = parseJsonLdMenu($);

		if (jsonLdData.dishes.length) {
			console.log(
				`Parsed menu from JSON-LD fallback: ${jsonLdData.dishes.length} dishes in ${jsonLdData.categories.length} categories`,
			);

			return jsonLdData;
		}
	}

	pruneEmptyCategories(categories, dishes);

	return {
		categories: [...categories.values()],
		dishes: [...dishes.values()],
	};
}

function parseChoiceQrSection($, $section, baseUrl, categories, dishes) {
	const sectionName = firstText($, $section, S.sectionName);

	if (!sectionName) {
		return;
	}

	const sectionSlug = slugify(sectionName);
	categories.set(sectionSlug, {
		name: sectionName,
		description: '',
		parent: '',
		slug: sectionSlug,
	});

	for (const categoryElement of $section.find(S.category.join(',')).toArray()) {
		const $category = $(categoryElement);
		const categoryName = firstText($, $category, S.categoryName);

		if (!categoryName) {
			continue;
		}

		const categorySlug = uniqueSlug(slugify(categoryName), categories, sectionSlug);
		categories.set(categorySlug, {
			name: categoryName,
			description: firstText($, $category, S.categoryDescription) || '',
			parent: sectionSlug,
			slug: categorySlug,
		});

		for (const dishElement of $category.find(S.dish.join(',')).toArray()) {
			addDish($, $(dishElement), categoryName, categorySlug, baseUrl, dishes);
		}
	}
}

function parseFlatCategories($, baseUrl, categories, dishes) {
	for (const categoryElement of $(S.category.join(',')).toArray()) {
		const $category = $(categoryElement);
		const categoryName = firstText($, $category, S.categoryName);

		if (!categoryName) {
			continue;
		}

		const categorySlug = slugify(categoryName);
		categories.set(categorySlug, {
			name: categoryName,
			description: firstText($, $category, S.categoryDescription) || '',
			parent: '',
			slug: categorySlug,
		});

		for (const dishElement of $category.find(S.dish.join(',')).toArray()) {
			addDish($, $(dishElement), categoryName, categorySlug, baseUrl, dishes);
		}
	}
}

function addDish($, $dish, categoryName, categorySlug, baseUrl, dishes) {
	const dish = toDish($, $dish, categoryName, categorySlug, baseUrl);

	if (!dish) {
		return;
	}

	if (dishes.has(dish.slug) && dishes.get(dish.slug)?.categorySlug !== dish.categorySlug) {
		dish.slug = `${dish.categorySlug}-${dish.slug}`;
		if (dish.image === `/item/${slugify(dish.name)}.webp`) {
			dish.image = `/item/${dish.slug}.webp`;
		}
	}

	if (!dishes.has(dish.slug)) {
		dishes.set(dish.slug, dish);
	}
}

function toDish($, $dish, categoryName, categorySlug, baseUrl) {
	const name = firstText($, $dish, S.dishName);

	if (!name || name === categoryName) {
		return null;
	}

	const priceText = firstText($, $dish, S.price) || $dish.text();
	const { price, currency } = parsePrice(priceText);
	const description = normalizeDescription(firstText($, $dish, S.dishDescription));
	const weight = firstText($, $dish, S.weight) || parseWeight($dish.text());
	const calories = firstText($, $dish, S.calories) || parseCalories($dish.text());
	const cookingTime = firstText($, $dish, S.cookingTime) || parseCookingTime($dish.text());
	const slug = slugify(name);
	const image = resolveImageUrl($, $dish, baseUrl);

	return {
		slug,
		categorySlug,
		name,
		description: description || null,
		price,
		currency,
		image: image || '/logo.webp',
		labels: weight ? [weight] : [],
		fullDescription: description || null,
		suggested: [],
		cookTimeMinutes: cookingTime,
		caloriesKcal: calories,
		portion: weight || null,
		allergens: parseAllergens(firstText($, $dish, S.allergens)),
	};
}

function firstText($, $root, selectors) {
	for (const selector of selectors) {
		const value = cleanText($root.find(selector).first().text());

		if (value) {
			return value;
		}
	}

	return '';
}

function resolveImageUrl($, $root, baseUrl) {
	for (const selector of S.image) {
		const $image = $root.find(selector).first();
		const raw =
			$image.attr('srcset')?.split(/\s+/)[0] ||
			$image.attr('data-src') ||
			$image.attr('src') ||
			$image.attr('data-image');

		if (raw) {
			return new URL(raw, baseUrl).toString();
		}
	}

	return null;
}

async function saveImages(dishes) {
	await mkdir(DEFAULT_IMAGE_DIR, { recursive: true });

	for (const dish of dishes) {
		if (!dish.image || dish.image.startsWith('/')) {
			continue;
		}

		try {
			const response = await fetch(dish.image);

			if (!response.ok) {
				continue;
			}

			const contentType = response.headers.get('content-type') || '';
			const extension =
				extensionFromContentType(contentType) ||
				path.extname(new URL(dish.image).pathname) ||
				'.jpg';
			const fileName = `${dish.slug}${extension}`;
			const filePath = path.join(DEFAULT_IMAGE_DIR, fileName);
			const buffer = Buffer.from(await response.arrayBuffer());
			await writeFile(filePath, buffer);
			dish.image = `/item/${fileName}`;
		} catch {
			// Keep the remote URL when a download fails.
		}
	}
}

function parseJsonLdMenu($) {
	const categories = new Map();
	const dishes = new Map();
	const sectionSlug = 'menu';

	categories.set(sectionSlug, {
		name: 'Меню',
		description: '',
		parent: '',
		slug: sectionSlug,
	});

	for (const script of $('script[type="application/ld+json"]').toArray()) {
		const rawValue = $(script).text();

		if (!rawValue.includes('MenuSection')) {
			continue;
		}

		let json;

		try {
			json = JSON.parse(rawValue);
		} catch {
			continue;
		}

		for (const section of findMenuSections(json)) {
			const categoryName = cleanText(section.name);

			if (!categoryName) {
				continue;
			}

			const categorySlug = uniqueSlug(slugify(categoryName), categories, sectionSlug);
			categories.set(categorySlug, {
				name: categoryName,
				description: '',
				parent: sectionSlug,
				slug: categorySlug,
			});

			const items = Array.isArray(section.hasMenuItem)
				? section.hasMenuItem
				: [section.hasMenuItem].filter(Boolean);

			for (const item of items) {
				const name = cleanText(item?.name);

				if (!name) {
					continue;
				}

				const slug = slugify(name);
				const description = normalizeDescription(item.description);
				const price = item.offers?.price ? Number.parseFloat(item.offers.price) : null;
				const currency = normalizeCurrency(item.offers?.priceCurrency || '₴');
				const dish = {
					slug: dishes.has(slug) ? `${categorySlug}-${slug}` : slug,
					categorySlug,
					name,
					description: description || null,
					price,
					currency,
					image: '/logo.webp',
					labels: [],
					fullDescription: description || null,
					suggested: [],
					cookTimeMinutes: null,
					caloriesKcal: null,
					portion: null,
					allergens: [],
				};

				dishes.set(dish.slug, dish);
			}
		}
	}

	if (dishes.size === 0) {
		categories.delete(sectionSlug);
	}

	return {
		categories: [...categories.values()],
		dishes: [...dishes.values()],
	};
}

function findMenuSections(value) {
	const sections = [];

	if (!value || typeof value !== 'object') {
		return sections;
	}

	if (value['@type'] === 'MenuSection') {
		sections.push(value);
	}

	for (const child of Object.values(value)) {
		if (Array.isArray(child)) {
			for (const item of child) {
				sections.push(...findMenuSections(item));
			}
		} else if (child && typeof child === 'object') {
			sections.push(...findMenuSections(child));
		}
	}

	return sections;
}

function logParseDiagnostics($) {
	const selectorMatches = {};

	for (const [group, selectors] of Object.entries(S)) {
		selectorMatches[group] = selectors
			.map((selector) => ({ selector, count: $(selector).length }))
			.filter((entry) => entry.count > 0);
	}

	const potentialCards = $(S.dish.join(',')).length;
	const firstNames = $(S.dishName.join(','))
		.map((_, element) => cleanText($(element).text()))
		.get()
		.filter(Boolean)
		.slice(0, 3);

	console.log(`Potential dish cards found: ${potentialCards}`);
	console.log('Working selectors:', JSON.stringify(selectorMatches, null, 2));
	console.log('First 3 dish names:', firstNames.join(' | ') || '(none)');
}

function pruneEmptyCategories(categories, dishes) {
	const usedSlugs = new Set();

	for (const dish of dishes.values()) {
		let categorySlug = dish.categorySlug;

		while (categorySlug) {
			const category = categories.get(categorySlug);

			if (!category || usedSlugs.has(categorySlug)) {
				break;
			}

			usedSlugs.add(categorySlug);
			categorySlug = category.parent;
		}
	}

	for (const category of categories.values()) {
		if (categories.size && category.parent && usedSlugs.has(category.parent)) {
			usedSlugs.add(category.parent);
		}
	}

	for (const categorySlug of [...categories.keys()]) {
		if (!usedSlugs.has(categorySlug)) {
			categories.delete(categorySlug);
		}
	}
}

function parsePrice(value) {
	const text = cleanText(value);
	const amount = text.match(/(?:\d+[.,]?)+/u)?.[0]?.replace(',', '.');
	const currency = text.match(/₴|грн|uah|eur|€|\$|usd/uim)?.[0] || '₴';

	return {
		price: amount ? Number.parseFloat(amount) : null,
		currency: normalizeCurrency(currency),
	};
}

function parseWeight(value) {
	return cleanText(value).match(/\b\d+(?:[.,]\d+)?\s?(?:г|kg|кг|ml|мл|l|л)\b/iu)?.[0] || null;
}

function parseCalories(value) {
	const match = cleanText(value).match(/(\d+)\s?(?:kcal|ккал|кал)/iu);
	return match ? Number.parseInt(match[1], 10) : null;
}

function parseCookingTime(value) {
	const match = cleanText(value).match(/(\d+)\s?(?:min|хв|мин)/iu);
	return match ? Number.parseInt(match[1], 10) : null;
}

function parseAllergens(value) {
	const text = cleanText(value);

	if (!text) {
		return [];
	}

	return text
		.replace(/^алергени?:?/iu, '')
		.split(/[,;•]/u)
		.map((item) => cleanText(item).toLowerCase())
		.filter(Boolean);
}

function normalizeCurrency(value) {
	const lower = String(value || '').toLowerCase();

	if (lower === 'грн' || lower === 'uah') {
		return '₴';
	}

	if (lower === 'eur') {
		return '€';
	}

	if (lower === 'usd') {
		return '$';
	}

	return value || '₴';
}

function normalizeDescription(value) {
	const text = cleanText(value);

	return text.replace(/^\[/u, '').replace(/\]$/u, '').trim();
}

function extensionFromContentType(contentType) {
	if (contentType.includes('webp')) return '.webp';
	if (contentType.includes('png')) return '.png';
	if (contentType.includes('jpeg') || contentType.includes('jpg')) return '.jpg';
	return '';
}

function cleanText(value) {
	return String(value || '').replace(/\s+/g, ' ').trim();
}

function uniqueSlug(slug, categories, parentSlug) {
	const existing = categories.get(slug);

	if (!existing || existing.parent === parentSlug) {
		return slug;
	}

	return `${parentSlug}-${slug}`;
}

function slugify(value) {
	const transliteration = {
		а: 'a',
		б: 'b',
		в: 'v',
		г: 'h',
		ґ: 'g',
		д: 'd',
		е: 'e',
		є: 'ye',
		ж: 'zh',
		з: 'z',
		и: 'y',
		і: 'i',
		ї: 'yi',
		й: 'i',
		к: 'k',
		л: 'l',
		м: 'm',
		н: 'n',
		о: 'o',
		п: 'p',
		р: 'r',
		с: 's',
		т: 't',
		у: 'u',
		ф: 'f',
		х: 'kh',
		ц: 'ts',
		ч: 'ch',
		ш: 'sh',
		щ: 'shch',
		ь: '',
		ю: 'yu',
		я: 'ya',
	};
	const transliterated = value
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[’']/g, '')
		.replace(/[а-яіїєґ]/g, (letter) => transliteration[letter] || letter);

	return transliterated
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '') || 'dish';
}

function writeJson(filePath, data) {
	return writeFile(filePath, `${JSON.stringify(data, null, '\t')}\n`, 'utf8');
}

function parseArgs(argv) {
	const parsed = { _: [] };

	for (const arg of argv) {
		if (!arg.startsWith('--')) {
			parsed._.push(arg);
			continue;
		}

		const [key, value] = arg.slice(2).split('=');
		parsed[key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] =
			value ?? true;
	}

	return parsed;
}
