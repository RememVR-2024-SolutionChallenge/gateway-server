import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudFunctionsRepository {
  private url: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.url = this.configService.get<string>('GCP_CLOUD_FUNCTIONS_URL');
  }

  async triggerAiScheduler(): Promise<void> {
    await this.httpService.post(this.url + '/engine-trigger');
  }
}
