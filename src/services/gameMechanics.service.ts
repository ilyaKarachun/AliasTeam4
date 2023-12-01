/* eslint-disable @typescript-eslint/naming-convention */
import { ExcelReaderService } from './excelReader.service';
import natural from 'natural';
import checkWord from 'check-word';

const stemmer = natural.PorterStemmer;
const wordCorrect = checkWord('en');

const gameMechanicsService = {
  randomWord: (difficulty: string, usedWords: string[]): string | null => {
    const result: string[] = [];

    const validDifficulties = ['easy', 'medium', 'hard'];
    const lowerCaseDifficulty = difficulty.toLowerCase();

    if (!validDifficulties.includes(lowerCaseDifficulty)) {
      console.error('Invalid difficulty level');
      return null;
    }

    const columnIndex = validDifficulties.indexOf(lowerCaseDifficulty);

    const excelReaderServiceInstance = new ExcelReaderService();
    excelReaderServiceInstance.readFile();

    const excelData = excelReaderServiceInstance.file;

    if (!excelData || !excelData[lowerCaseDifficulty]) {
      console.error(
        `No data found for difficulty level: ${lowerCaseDifficulty}`,
      );
      return null;
    }

    const docWords = excelData[lowerCaseDifficulty];

    while (docWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * docWords.length);
      const randomWord = docWords.splice(randomIndex, 1)[0];

      if (
        randomWord &&
        randomWord[columnIndex] &&
        !usedWords.includes(randomWord)
      ) {
        result.push(randomWord);
        usedWords.push(randomWord);
        break;
      }
    }
    return result[0];
  },

  hiddenWordRecognition: (
    hidden: string,
    guess: string,
  ): { isGuessed: boolean; word: string } => {
    const hiddenLower = hidden.toLowerCase();
    const guessArr = guess.split(' ');
    let isGuessed;

    guessArr.map((el) => {
      el = el.toLocaleLowerCase();
      isGuessed = hiddenLower === el;
    });

    return isGuessed;
  },

  rootWordRecognition: (
    word: string,
    description: string,
  ): { message: string; words: string[]; wrong: boolean } => {
    const arrDescription = description.split(' ');
    const rootHidden = stemmer.stem(word);
    const cheatWords: string[] = [];
    const wrongWords: string[] = [];

    arrDescription.map((el) => {
      el = el.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, '');
      if (wordCorrect.check(el)) {
        const rootDescription = stemmer.stem(el);
        if (rootHidden === rootDescription) {
          cheatWords.push(el);
          return {
            word: el,
            rootMatch: true,
          };
        }
      } else {
        wrongWords.push(el);
      }
    });

    if (cheatWords.length > 0 || wrongWords.length > 0) {
      return {
        message:
          "Please, don't use similar or non-existent words for your description",
        words: [...cheatWords, ...wrongWords],
        wrong: true,
      };
    } else
      return {
        message: 'Words had checked',
        words: cheatWords,
        wrong: false,
      };
  },
};

export default gameMechanicsService;
