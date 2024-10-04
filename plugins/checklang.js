const languageFiles = {
  'pt': '../locales/portuguese.json',
  'pt-br': '../locales/portuguese.json',
  'pt-pt': '../locales/portuguese.json',
  'en': '../locales/english.json',
  'en-us': '../locales/english.json',
  'en-gb': '../locales/english.json',
  'es': '../locales/spanish.json',
  'es-es': '../locales/spanish.json',
  'es-mx': '../locales/spanish.json',
  'es-ar': '../locales/spanish.json',
  'es-co': '../locales/spanish.json',
  'es-cl': '../locales/spanish.json',
  'es-pe': '../locales/spanish.json',
};

function getStrings(languageCode) {
  const filePath = languageFiles[languageCode] || languageFiles['en'];
  try {
    return require(filePath);
  } catch (error) {
    console.error(`Error loading language file for code ${languageCode}:`, error);
    return require(languageFiles['en']);
  }
}

module.exports = {
  getStrings
};