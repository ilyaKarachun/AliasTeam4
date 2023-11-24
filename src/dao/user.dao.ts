import { MangoResponse } from 'nano';
import { db } from '../database/database';
import { CreateUserDto, UserDto } from '../dto/user.dto';
import { User } from '../types/DBSheme';

class UserDao {
  save(data: CreateUserDto) {
    return db.insert({
      ...data,
      _id: `user-${data.email}`,
      type: 'user',
    } as any);
  }

  async getByEmail(
    email: string,
  ): Promise<{ dto: UserDto; password: string } | null> {
    const req = await db.find({
      selector: {
        email: { $eq: email },
      },
    });

    const userData = req?.docs?.[0];

    if (userData) {
      return {
        // @ts-expect-error
        dto: new UserDto({ ...userData, id: userData._id }),
        // @ts-expect-error
        password: userData.password,
      };
    }

    return null;
  }

  async getAll() {
    const req = await db.view<UserDto>('user', 'all');

    if (!req) return [];

    return req.rows.map((user) => new UserDto({ ...user.value, id: user.id }));
  }
}

const userDao = new UserDao();
export { UserDao, userDao };
