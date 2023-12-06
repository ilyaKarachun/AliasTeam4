class CreateUserDto {
  username: string;
  password: string;
  email: string;

  constructor({
    username,
    password,
    email,
  }: {
    username: string;
    password: string;
    email: string;
  }) {
    this.username = username;
    this.password = password;
    this.email = email;
  }
}

class UserDto {
  id: string;
  username: string;
  email: string;
  statistic?: Record<string, any> | undefined;
  status: string;

  constructor({
    username,
    email,
    statistic,
    status = 'not active',
    id,
  }: {
    username: string;
    email: string;
    statistic?: Record<string, any> | undefined;
    status?: string;
    id: string;
  }) {
    this.username = username;
    this.email = email;
    this.statistic = statistic;
    this.status = status;
    this.id = id;
  }
}

export { CreateUserDto, UserDto };
