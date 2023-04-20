import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  testRout() {
    return 'Hello World!';
  }
}
