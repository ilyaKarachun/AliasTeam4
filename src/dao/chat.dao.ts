import { db } from '../database/database';
import { ChatDto } from '../dto/chat.dto';

class ChatDao {
  create() {
    db.insert(
      {
        type: 'chat',
      } as any,
      (err, result) => {
        if (err) {
          console.error(err);
        } else {
          const insertedId = result.id;
          console.log(`Chat has an _id: ${insertedId}`);
        }
      },
    );
  }
}

const chatDao = new ChatDao();
export { ChatDao, chatDao };
