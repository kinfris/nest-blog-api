export class ReturnUserDto {
  id: string;
  login: string;
  email: string;
  createdAt: Date;

  constructor(user) {
    this.id = user._id;
    this.login = user.login;
    this.email = user.email;
    this.createdAt = user.createdAt;
  }
}
