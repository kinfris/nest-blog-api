import { Controller, Delete, HttpCode } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('testing')
export class TestController {
  constructor(private testService: TestService) {}

  @Delete('/all-data')
  @HttpCode(204)
  deleteUser() {
    return this.testService.clearDb();
  }
}
