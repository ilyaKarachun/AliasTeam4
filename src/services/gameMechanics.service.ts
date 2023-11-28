/* eslint-disable @typescript-eslint/naming-convention */
import { ExcelReaderService } from './excelReader.service';
import natural from 'natural';

const stemmer = natural.PorterStemmerRu;

const gameMechanicsService = {
  randomWord: (difficulty: string, usedWords: string[]): string | null => {
    const result: string[] = [];

    const validDifficulties = ['Easy', 'Medium', 'Hard'];
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

  hiddenWordRecognition: (hidden: string, guess: string) => {
    const hiddenLower = hidden.toLowerCase();
    const guessLower = guess.toLowerCase();

    if (hiddenLower === guessLower) {
      return true;
    } else {
      return false;
    }
  },

  rootWordRecognition: (word: string, description: string) => {
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
        return {
          message: 'Words had checked',
          words: wrongWords,
          wrong: false,
        };
    });
  },

  assignTeamAndUserTurn: (result: any) => {
    const trackerFull = result.tracker;
    let prevUserIndex;

    if (Object.keys(trackerFull).length === 0) {
      trackerFull.active_team = 'team_1';
      trackerFull.active_user = result.team_1[0];
      trackerFull.prev_user = null;
      return trackerFull;
    } else {
      trackerFull.active_team =
        trackerFull.active_team === 'team_1' ? 'team_2' : 'team_1';

      if (trackerFull.prev_user === null) {
        prevUserIndex = 0;
      } else {
        prevUserIndex = result[trackerFull.active_team].indexOf(
          trackerFull.prev_user,
        );
      }
      trackerFull.prev_user = trackerFull.active_user;

      if (prevUserIndex === result[trackerFull.active_team].length - 1) {
        trackerFull.active_user = result[trackerFull.active_team][0];
      } else {
        trackerFull.active_user =
          result[trackerFull.active_team][prevUserIndex + 1];
      }

      return trackerFull;
    }
  },
};

// const result = {
//   team_1: ['user1', 'user2', 'user3'],
//   team_2: ['user4', 'user5', 'user6'],
//   tracker: {},
// };
// console.log(gameMechanicsService.assignTeamAndUserTurn(result));
// localstart: npx ts-node src/services/gameMechanics.service.ts

export default gameMechanicsService;
