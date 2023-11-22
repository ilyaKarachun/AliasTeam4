import natural from 'natural';

const stemmer = natural.PorterStemmerRu;

const rootWordRecognition = (word: string, description: string) => {
  const arrDescription = description.split(' ');
  const rootHidden = stemmer.stem(word);

  arrDescription.map((el) => {
    el = el.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, '');
    const rootDescription = stemmer.stem(el);
    if (rootHidden === rootDescription) {
      return {
        word: el,
        rootMatch: true,
      };
    } else return 'words does not match';
  });
};

export default rootWordRecognition;
