import { Controller, Delete, Get, HttpCode, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { DevicesService } from './devices.service';

@Controller('/security/devices')
export class DevicesController {
  constructor(private deviceService: DevicesService) {}

  @Get()
  getUserSessions(@Req() req: Request) {
    const { refreshToken } = req.cookies;
    return this.deviceService.getUserSessions(refreshToken);
  }

  @Delete('')
  @HttpCode(204)
  async deleteAllSessionsExceptCurrent(@Req() req: Request) {
    const { refreshToken } = req.cookies;
    await this.deviceService.deleteAllSessionsExceptCurrent(refreshToken);
    return;
  }

  @Delete('/:deviceId')
  @HttpCode(204)
  async deleteCurrentSession(
    @Req() req: Request,
    @Param() { deviceId }: { deviceId: string },
  ) {
    const { refreshToken } = req.cookies;
    await this.deviceService.deleteCurrenSession(refreshToken, deviceId);
    return;
  }
}
