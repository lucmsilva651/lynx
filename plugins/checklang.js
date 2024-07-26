function getStrings(languageCode) {
  if (languageCode === 'pt' || 'pt-br') {
    return require('../locales/portuguese.json');
  } else {
    return require('../locales/english.json');
  }
}

module.exports = {
  getStrings
};