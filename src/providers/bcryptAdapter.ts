import bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

export class BcryptAdapter {
  generateHash(password: string) {
    return bcrypt.hash(password, 10);
  }

  async checkPassword(password: string, passHash: string) {
    return bcrypt.compare(password, passHash);
  }

  async checkArrayOfPasswords(
    passwordsHashes: Array<string>,
    password: string,
  ) {
    for (let i = 0; i < passwordsHashes.length; i++) {
      const isPassMatched = await bcrypt.compare(password, passwordsHashes[i]);
      if (isPassMatched)
        throw new BadRequestException('this password already been used');
    }
  }
}
