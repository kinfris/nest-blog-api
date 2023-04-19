export class ReturnUserDto {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
  banInfo: {
    banDate: Date | null;
    banReason: string | null;
    isBanned: boolean;
  } = {
    banDate: null,
    banReason: null,
    isBanned: false,
  };

  constructor(user, banInfo) {
    this.id = user.id;
    this.login = user.login;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.banInfo.banDate = banInfo?.banDate ?? null;
    this.banInfo.banReason = banInfo?.banReason ?? null;
    this.banInfo.isBanned = banInfo?.isBanned ?? false;
  }
}
