import { Controller, Delete } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('testing')
export class TestController {
  constructor(private testService: TestService) {}

  @Delete('/all-data')
  deleteUser() {
    return this.testService.clearDb();
  }
}
