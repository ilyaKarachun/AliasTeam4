import { CreateUserDto, UserDto } from '../dto/user.dto';
import HttpException from '../exceptions/httpException';
import { TokenService, tokenService } from './token.service';
import bcrypt from 'bcrypt';
import { userDao } from '../dao/user.dao';
import { USER_STATUSES } from '../helpers/contstants';

class UserService {
  tokenService: TokenService;

  constructor({ tokenService }: { tokenService: TokenService }) {
    this.tokenService = tokenService;
  }

  async registration(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      data.password,
      +(process.env.SALT_ROUNDS as string),
    );

    const newUser: Omit<UserDto, 'id'> = {
      ...data,
      statistic: [],
      status: USER_STATUSES.NOT_ACTIVE,
    };

    return userDao.save({ ...newUser, password: hashedPassword });
  }

  async login(data: Omit<CreateUserDto, 'username'>) {
    const userData = await userDao.getByEmail(data.email);

    if (!userData) {
      throw new HttpException(400, 'Password or Email is not correct!');
    }

    /**
     * check password
     */
    let isValidPassword = await bcrypt.compare(
      data.password,
      (userData as any).password,
    );
    if (!isValidPassword) {
      throw new HttpException(400, 'Wrong Email Or Password!');
    }

    return {
      user: userData.dto,
      token: this.tokenService.generateToken(userData.dto),
    };
  }

  async getUserById({ id }: { id: string }) {
    const result = await userDao.getById(id);
    return result?.dto;
  }

  async updateStatistics({
    statistic,
    id,
  }: {
    statistic: Record<string, any>;
    id: string;
  }) {
    const result = await userDao.updateById(id, { statistic });
    if (!result) {
      throw new HttpException(404, 'User Was Not Found');
    }

    return;
  }

  deleteUser({ id }: { id: string }) {
    return userDao.deleteById(id);
  }

  getAll() {
    return userDao.getAll();
  }
}

const userService = new UserService({ tokenService });

export { userService };
