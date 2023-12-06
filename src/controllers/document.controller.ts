import { Request, Response } from 'express';
import { db } from '../database/database';

class DocumentController {
  async createDocument(request: Request, response: Response) {
    try {
      const document = request.body;

      const createdDocument = await db.insert(document);
      const insertedDocument = await db.get(createdDocument.id);

      response.json({
        status: 'success',
        data: insertedDocument,
      });
    } catch (error) {
      console.error('Error creating document:', error);
      response.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
  }

  async getAllDocuments(request: Request, response: Response) {
    try {
      // Используйте db.list() или db.fetch() для получения списка документов
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const result = await db.list({ include_docs: true });
      const documents = result.rows.map((row) => row.doc);

      response.json({
        status: 'success',
        data: documents,
      });
    } catch (error) {
      console.error('Error getting documents:', error);
      response.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
  }
}

export default new DocumentController();
