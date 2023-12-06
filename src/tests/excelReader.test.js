const { excelReaderService } = require('../services/excelReader.service');

describe('test', () => {
  it('test', () => {
    const reader = excelReaderService;
    reader.readFile();

    expect(reader.file).toBeTruthy();
  });
});
