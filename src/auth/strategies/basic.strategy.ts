import { BasicStrategy as Strategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  public validate = async (username, password): Promise<boolean> => {
    if (
      process.env.SA_USERNAME === username &&
      process.env.SA_PASSWORD === password
    ) {
      return true;
    }
    throw new UnauthorizedException();
  };
}
