class CreateUserDto {
  username: string;
  password: string;

  constructor({ username, password }: { username: string; password: string }) {
    this.username = username;
    this.password = password;
  }
}

class UserDto {
  username: string;
  email: string;
  statistic?: Record<string, any> | undefined;
  status: string;

  constructor({
    username,
    email,
    statistic,
    status = 'not active',
  }: {
    username: string;
    email: string;
    statistic?: Record<string, any> | undefined;
    status?: string;
  }) {
    this.username = username;
    this.email = email;
    this.statistic = statistic;
    this.status = status;
  }
}

export { CreateUserDto, UserDto };
