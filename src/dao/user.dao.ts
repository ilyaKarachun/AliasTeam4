import { db } from '../database/database';
import { CreateUserDto, UserDto } from '../dto/user.dto';

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

  async getById(
    id: string,
  ): Promise<{ dto: UserDto; password: string; _rev: string } | null> {
    const req = await db.find({
      selector: {
        type: 'user',
        _id: { $eq: id },
      },
    });

    const userData = req?.docs?.[0];

    if (userData) {
      return {
        // @ts-expect-error
        dto: new UserDto({ ...userData, id: userData._id }),
        // @ts-expect-error
        password: userData.password,
        _rev: userData._rev,
      };
    }

    return null;
  }

  async updateById(id: string, data: {}) {
    const req = await db.find({
      selector: {
        type: 'user',
        _id: { $eq: id },
      },
    });
    const userData = req?.docs?.[0];
    let updatedUser = { ...userData };
    if (!userData) {
      return null;
    }

    if ('statistic' in data) {
      // @ts-expect-error
      updatedUser?.statistic?.push(data.statistic);
    }

    const result = await db.insert({
      ...updatedUser,
    });
    return result.ok;
  }

  async getAll() {
    const req = await db.view<UserDto>('user', 'all');
    if (!req) return [];

    return req.rows.map((user) => new UserDto({ ...user.value, id: user.id }));
  }

  async deleteById(id: string) {
    const user = await this.getById(id);
    if (user) {
      await db.destroy(user.dto.id, user._rev);
    }

    return;
  }
}

const userDao = new UserDao();
export { UserDao, userDao };
