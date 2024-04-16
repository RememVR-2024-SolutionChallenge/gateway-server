import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SampleVrResourceService } from './service/sample-vr-resource.service';

@ApiTags('Sample')
@Controller('/sample')
export class SampleController {
  constructor(
    private readonly sampleVrResourceService: SampleVrResourceService,
  ) {}

  //   @ApiOperation({ summary: '헬스체크' })
  //   @Get('/')
  //   async healthCheck(): Promise<{ message: string }> {
  //     return { message: 'ok' };
  //   }
}
