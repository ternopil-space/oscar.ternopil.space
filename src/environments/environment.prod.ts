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
	companyId: 'oscar',
	appVersion: '1.0.0',
	production: true,
	defaultLanguage: 'ua',
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
	],
};
