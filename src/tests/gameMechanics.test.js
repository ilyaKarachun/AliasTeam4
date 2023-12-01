const {
  default: gameMechanicsService,
} = require('../services/gameMechanics.service');

describe('gameMechanicsService', () => {
  describe('rootWordRecognition', () => {
    it('should return correct result for non-matching root words', () => {
      const word = 'test';
      const description = 'This is a checking sentence.';
      const result = gameMechanicsService.rootWordRecognition(
        word,
        description,
      );

      expect(result.message).toBe('Words had checked');
      expect(result.words).toEqual([]);
      expect(result.wrong).toBe(false);
    });

    it('should return incorrect result for matching root words', () => {
      const word = 'test';
      const description = 'This is a test sentence.';
      const result = gameMechanicsService.rootWordRecognition(
        word,
        description,
      );

      expect(result.message).toBe(
        "Please, don't use similar words for your description",
      );
      expect(result.words).toHaveLength(1);
      expect(result.wrong).toBe(true);
    });
  });

  describe('gameMechanicsService.randomWord', () => {
    let fakeExcelReaderService;

    beforeEach(() => {
      fakeExcelReaderService = {
        file: {
          easy: [
            { word: 'word1', easy: 'definition1' },
            { word: 'word2', easy: 'definition2' },
          ],
          Medium: [
            { word: 'word3', medium: 'definition3' },
            { word: 'word4', medium: 'definition4' },
          ],
          Hard: [
            { word: '', hard: '' },
            { word: '', hard: '' },
          ],
        },
        readFile: jest.fn(),
      };
    });

    it('should return a random word for valid difficulty level', () => {
      const difficulty = 'easy';
      const usedWords = [];

      const result = gameMechanicsService.randomWord(difficulty, usedWords);

      expect(result).toBeDefined();
      expect(usedWords).toContain(result);
    });

    it('should log an error for an invalid difficulty level', () => {
      const invalidDifficulty = 'invalid';
      const usedWords = [];

      const consoleErrorMock = jest.spyOn(console, 'error');
      consoleErrorMock.mockImplementation(() => {});

      const result = gameMechanicsService.randomWord(
        invalidDifficulty,
        usedWords,
      );

      expect(consoleErrorMock.mock.calls.length).toBe(1);
      expect(consoleErrorMock.mock.calls[0][0]).toBe(
        'Invalid difficulty level',
      );
    });
  });

  describe('gameMechanicsService.hiddenWordRecognition', () => {
    it('should return true if the guess matches the hidden word', () => {
      const hiddenWord = 'apple';
      const guess = 'apple';

      const result = gameMechanicsService.hiddenWordRecognition(
        hiddenWord,
        guess,
      );

      expect(result).toBe(true);
    });

    it('should return false if the guess does not match the hidden word', () => {
      const hiddenWord = 'apple';
      const guess = 'orange';

      const result = gameMechanicsService.hiddenWordRecognition(
        hiddenWord,
        guess,
      );

      expect(result).toBe(false);
    });

    it('should handle case-insensitive comparisons', () => {
      const hiddenWord = 'Apple';
      const guess = 'aPpLe';

      const result = gameMechanicsService.hiddenWordRecognition(
        hiddenWord,
        guess,
      );

      expect(result).toBe(true);
    });

    it('should handle multiple words in the guess', () => {
      const hiddenWord = 'apple';
      const guess = 'apple banana cherry';

      const result = gameMechanicsService.hiddenWordRecognition(
        hiddenWord,
        guess,
      );

      expect(result).toBe(true);
    });

    it('should handle an empty guess', () => {
      const hiddenWord = 'apple';
      const guess = '';

      const result = gameMechanicsService.hiddenWordRecognition(
        hiddenWord,
        guess,
      );

      expect(result).toBe(false);
    });
  });
});
