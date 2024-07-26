function getStrings(languageCode) {
    if (languageCode === 'pt-br') {
      return require('../locales/portuguese.json');
    } else {
      return require('../locales/english.json');
    }
}

module.exports = {
    getStrings
  };