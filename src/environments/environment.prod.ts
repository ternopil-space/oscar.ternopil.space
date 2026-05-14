export interface AppLanguage {
	code: string;
	name: string;
	nativeName: string;
	flagSrc: string;
	htmlLang: string;
	population: number;
}

export const environment: {
	apiUrl: string;
	companyId: string;
	appVersion: string;
	production: boolean;
	defaultLanguage: string;
	languages: AppLanguage[];
} = {
	apiUrl: 'https://it.webart.work',
	companyId: 'demo',
	appVersion: '1.0.0',
	production: true,
	defaultLanguage: 'en',
	languages: [
		{
			code: 'en',
			name: 'English',
			nativeName: 'English',
			flagSrc: 'flags/united-kingdom.svg',
			htmlLang: 'en',
			population: 280,
		},
		{
			code: 'de',
			name: 'German',
			nativeName: 'Deutsch',
			flagSrc: 'flags/germany.svg',
			htmlLang: 'de',
			population: 130,
		},
		{
			code: 'fr',
			name: 'French',
			nativeName: 'Français',
			flagSrc: 'flags/france.svg',
			htmlLang: 'fr',
			population: 110,
		},
		{
			code: 'ua',
			name: 'Ukrainian',
			nativeName: 'Українська',
			flagSrc: 'flags/ukraine.svg',
			htmlLang: 'uk',
			population: 35,
		},
		{
			code: 'pl',
			name: 'Polish',
			nativeName: 'Polski',
			flagSrc: 'flags/poland.svg',
			htmlLang: 'pl',
			population: 45,
		},
		{
			code: 'ro',
			name: 'Romanian',
			nativeName: 'Română',
			flagSrc: 'flags/romania.svg',
			htmlLang: 'ro',
			population: 28,
		},
		{
			code: 'hu',
			name: 'Hungarian',
			nativeName: 'Magyar',
			flagSrc: 'flags/hungary.svg',
			htmlLang: 'hu',
			population: 13,
		},
		{
			code: 'el',
			name: 'Greek',
			nativeName: 'Ελληνικά',
			flagSrc: 'flags/greece.svg',
			htmlLang: 'el',
			population: 13,
		},
		{
			code: 'cs',
			name: 'Czech',
			nativeName: 'Čeština',
			flagSrc: 'flags/czechia.svg',
			htmlLang: 'cs',
			population: 12,
		},
		{
			code: 'it',
			name: 'Italian',
			nativeName: 'Italiano',
			flagSrc: 'flags/italy.svg',
			htmlLang: 'it',
			population: 70,
		},
		{
			code: 'es',
			name: 'Spanish',
			nativeName: 'Español',
			flagSrc: 'flags/spain.svg',
			htmlLang: 'es',
			population: 75,
		},
		{
			code: 'nl',
			name: 'Dutch',
			nativeName: 'Nederlands',
			flagSrc: 'flags/netherlands.svg',
			htmlLang: 'nl',
			population: 25,
		},
		{
			code: 'pt',
			name: 'Portuguese',
			nativeName: 'Português',
			flagSrc: 'flags/portugal.svg',
			htmlLang: 'pt',
			population: 15,
		},
		{
			code: 'sv',
			name: 'Swedish',
			nativeName: 'Svenska',
			flagSrc: 'flags/sweden.svg',
			htmlLang: 'sv',
			population: 12,
		},
	],
};
