/* eslint-disable @typescript-eslint/naming-convention */
import { ExcelReaderService } from './excelReader.service';
import natural from 'natural';
import fuzz from 'fuzzball';

const stemmer = natural.PorterStemmer;

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

  hiddenWordRecognition: (hidden: string, guess: string): boolean => {
    const hiddenLower = hidden.toLowerCase();
    const isGuessed = guess.split(' ');

    return isGuessed.some((el) => el.toLowerCase() === hiddenLower);
  },

  rootWordRecognition: (word: string, description: string) => {
    const arrDescription = description.split(' ');
    const rootHidden = stemmer.stem(word);
    const wrongWords: string[] = [];

    arrDescription.forEach((el) => {
      el = el.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, '');
      const rootDescription = stemmer.stem(el);

      const similarity = fuzz.token_set_ratio(rootHidden, rootDescription);

      const similarityThreshold = 75;

      if (similarity > similarityThreshold) {
        wrongWords.push(el);
      }
    });

    if (wrongWords.length > 0) {
      return {
        message: "Please, don't use similar words for your description",
        words: wrongWords,
        wrong: true,
      };
    } else {
      return {
        message: 'Words had checked',
        words: wrongWords,
        wrong: false,
      };
    }
  },
};

export default gameMechanicsService;
