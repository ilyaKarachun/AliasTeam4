import { CreateUserDto, UserDto } from '../dto/user.dto';
import HttpException from '../exceptions/httpException';
import { TokenService, tokenService } from './token.service';

class UserService {
  tokenService: TokenService;

  constructor({ tokenService }: { tokenService: TokenService }) {
    this.tokenService = tokenService;
  }

  registration(data: CreateUserDto) {
    return data;
  }

  login(data: CreateUserDto) {
    const isValidPassword = true;
    /**
     * check password
     */
    if (!isValidPassword) {
      throw new HttpException(400, 'Wrong Email Or Password!');
    }

    return {
      user: data,
      token: this.tokenService.generateToken(data),
    };
  }
  getUserById({ id }: { id: string }) {
    let result;
    /**
     * add method connect to db
     */
    return new UserDto({
      username: result.username,
      email: result.email,
      statistic: result.statistic,
      status: result.status,
    });
  }
  updateStatistics({
    statistic,
    id,
  }: {
    statistic: Record<string, any>;
    id: string;
  }) {
    /**
     * add method connect to db
     */
    return;
  }
  deleteUser({ id }: { id: string }) {
    /**
     * add method connect to db
     */
    return;
  }
}

const userService = new UserService({ tokenService });

export { userService };
