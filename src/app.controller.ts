import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Root')
@Controller('/')
export class AppController {
  constructor() {}

  @ApiOperation({ summary: '헬스체크' })
  @Get('/')
  async healthCheck(): Promise<{ message: string }> {
    return { message: 'ok' };
  }
}
