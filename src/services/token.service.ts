import * as jwt from 'jsonwebtoken';
import { UserDto } from '../dto/user.dto';

interface TokenData {
  user: UserDto;
  iat: number;
  exp: number;
}

class TokenService {
  userData: TokenData | null;
  constructor() {
    this.userData = null;
  }
  generateToken(tokenData: UserDto): string {
    const token = jwt.sign(
      { user: tokenData },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      },
    );
    return token;
  }

  verifyToken(token: string): TokenData | null {
    try {
      // jwt.verify method throws an error if token is invalid or expired
      // so we catch this error and return null
      this.userData = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as TokenData;

      return this.userData;
    } catch (e) {
      return null;
    }
  }
}

const tokenService = new TokenService();

export { TokenService, tokenService };
