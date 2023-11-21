import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from '../dto/user.dto';

class TokenService {
  generateToken(tokenData: CreateUserDto): string {
    const token = jwt.sign(tokenData, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    });
    return token;
  }

  verifyToken(token: string) {
    try {
      // jwt.verify method throws an error if token is invalid or expired
      // so we catch this error and return null
      const userData = jwt.verify(token, process.env.JWT_SECRET as string);
      return userData;
    } catch (e) {
      return null;
    }
  }
}

const tokenService = new TokenService();

export { TokenService, tokenService };
