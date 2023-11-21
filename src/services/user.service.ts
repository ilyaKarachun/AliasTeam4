import { CreateUserDto } from '../dto/user.dto';
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
      token: this.tokenService.generateToken({ userId: 1, email: '123' }),
    };
  }
}

const userService = new UserService({ tokenService });

export { userService };
