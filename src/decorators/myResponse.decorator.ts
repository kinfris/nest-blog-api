import { Response } from '@nestjs/common';

declare module 'express' {
  export interface Response {
    cookie(name: string, value: any, options?: any): any;
  }
}

Response.prototype.cookie = function (name: string, value: any, options?: any) {
  const serializedCookie = `${name}=${value}`;
  this.setHeader('Set-Cookie', serializedCookie);
  return this;
};
