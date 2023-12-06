export const words = ['apple', 'cherry', 'potato', 'candle', 'cat', 'wallet'];
// in process of developing
export const shuffleArray = (arr: string[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

class WordService {
  copyWords: string[];
  shuffledWords: string[];
  usedWords: string[];

  constructor(copyWords: string[]) {
    this.copyWords = copyWords.slice();
    this.shuffledWords = shuffleArray(this.copyWords);
    this.usedWords = [];
  }

  addWord({ word }: { word: string }) {
    /**
     * add method connect to db or array of words
     */
    return;
  }
  getRandomWord() {
    let randomWord;
    return randomWord;
  }
  deleteWord({ id }: { id: string }) {}
}
const wordService = new WordService(words);

export { wordService };
