import excelToJson from 'convert-excel-to-json';
import fs from 'fs';
import { WORDS_PATH } from '../helpers/contstants';

class ExcelReaderService {
  file: { [key: string]: any[] } | null;
  path: string;

  constructor(path: string = WORDS_PATH) {
    this.file = null;
    this.path = path;
  }

  readFile({
    columnToKey = {
      A: 'easy',
      B: 'medium',
      C: 'hard',
    },
  }: {
    columnToKey?: Record<string, string>;
  } = {}) {
    const result = {};
    const src = fs.readFileSync(this.path);
    const readFile = excelToJson({
      source: src,
      columnToKey,
    });

    // read sheets
    Object.values(readFile).forEach((sheets) => {
      // read columns in sheets
      sheets.forEach((columns: Record<string, string>) => {
        // save each record in array
        Object.entries(columns).forEach(([key, value]) => {
          if (!Array.isArray(result[key])) {
            result[key] = [];
          }
          result[key].push(value);
        });
      });
    });

    this.file = result;
    return result;
  }
}

const excelReaderService = new ExcelReaderService();

export { excelReaderService, ExcelReaderService };
