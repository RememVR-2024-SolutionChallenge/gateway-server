import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('Root')
@Controller('/')
export class AppController {
  private AI_SERVER_URL: string;

  constructor(private readonly configService: ConfigService) {
    this.AI_SERVER_URL = this.configService.get('AI_SERVER_URL');
  }

  @ApiOperation({ summary: '헬스체크' })
  @Get('/')
  async healthCheck(): Promise<{ message: string }> {
    return { message: 'ok' };
  }

  @ApiOperation({ summary: 'AI 헬스체크' })
  @Get('/')
  async healthCheckAI(): Promise<{ message: string }> {
    const response = await fetch(`${this.AI_SERVER_URL}/`);
    if (response.status === 200) {
      return { message: 'ok' };
    } else {
      throw new ServiceUnavailableException('AI 서버가 응답하지 않습니다.');
    }
  }
}
