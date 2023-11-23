import natural from 'natural';

const stemmer = natural.PorterStemmerRu;

const rootWordRecognition = (word: string, description: string) => {
  const arrDescription = description.split(' ');
  const rootHidden = stemmer.stem(word);
  const wrongWords: string[] = [];

  arrDescription.map((el) => {
    el = el.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, '');
    const rootDescription = stemmer.stem(el);
    if (rootHidden === rootDescription) {
      wrongWords.push(el);
      return {
        word: el,
        rootMatch: true,
      };
    }

    if (wrongWords.length < 0) {
      return {
        message: "Please, don't use similar words for your description",
        words: wrongWords,
        wrong: true,
      };
    } else
      return { message: 'Words had checked', words: wrongWords, wrong: false };
  });
};

export default rootWordRecognition;
