/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const randomWords = (arr: any) => {
  const result: string[] = [];
  const maxWordsToSelect = 10;

  for (const doc of arr) {
    if (doc && doc.words && Array.isArray(doc.words)) {
      const docWords = doc.words;

      while (docWords.length > 0 && result.length < maxWordsToSelect) {
        const randomIndex = Math.floor(Math.random() * docWords.length);
        const randomWord = docWords.splice(randomIndex, 1)[0];
        result.push(randomWord);
      }

      if (result.length === maxWordsToSelect) {
        break;
      }
    }
  }

  return result;
};

export default randomWords;
