
export const supportedLanguages = [
  'English',
  'Assamese',
  'Bengali',
  'Bodo',
  'Dogri',
  'Gujarati',
  'Hindi',
  'Kannada',
  'Kashmiri',
  'Konkani',
  'Maithili',
  'Malayalam',
  'Manipuri',
  'Marathi',
  'Nepali',
  'Odia',
  'Punjabi',
  'Sanskrit',
  'Santali',
  'Sindhi',
  'Tamil',
  'Telugu',
  'Urdu'
];

export interface LanguageConfig {
  code: string;
  dir: 'ltr' | 'rtl';
}

export const languageConfig: Record<string, LanguageConfig> = {
  'English': { code: 'en-IN', dir: 'ltr' },
  'Assamese': { code: 'as-IN', dir: 'ltr' },
  'Bengali': { code: 'bn-IN', dir: 'ltr' },
  'Bodo': { code: 'brx-IN', dir: 'ltr' },
  'Dogri': { code: 'doi-IN', dir: 'ltr' },
  'Gujarati': { code: 'gu-IN', dir: 'ltr' },
  'Hindi': { code: 'hi-IN', dir: 'ltr' },
  'Kannada': { code: 'kn-IN', dir: 'ltr' },
  'Kashmiri': { code: 'ks-IN', dir: 'ltr' },
  'Konkani': { code: 'kok-IN', dir: 'ltr' },
  'Maithili': { code: 'mai-IN', dir: 'ltr' },
  'Malayalam': { code: 'ml-IN', dir: 'ltr' },
  'Manipuri': { code: 'mni-IN', dir: 'ltr' },
  'Marathi': { code: 'mr-IN', dir: 'ltr' },
  'Nepali': { code: 'ne-IN', dir: 'ltr' },
  'Odia': { code: 'or-IN', dir: 'ltr' },
  'Punjabi': { code: 'pa-IN', dir: 'ltr' },
  'Sanskrit': { code: 'sa-IN', dir: 'ltr' },
  'Santali': { code: 'sat-IN', dir: 'ltr' },
  'Sindhi': { code: 'sd-IN', dir: 'ltr' },
  'Tamil': { code: 'ta-IN', dir: 'ltr' },
  'Telugu': { code: 'te-IN', dir: 'ltr' },
  'Urdu': { code: 'ur-IN', dir: 'rtl' }
};
