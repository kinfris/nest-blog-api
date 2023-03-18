import * as bcrypt from 'bcrypt';

export const BcryptAdapter = {
  async generateHash(password: string) {
    const saltOrRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltOrRounds);
    return { passwordSalt: saltOrRounds, passwordHash };
  },
};
