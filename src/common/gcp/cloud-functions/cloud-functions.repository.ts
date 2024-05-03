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
    const res = await this.httpService
      .post(this.url + '/engine-trigger')
      .toPromise()
      .then((res) => res.data)
      .catch((error) => {
        if (error.response) {
          if (error.response.status >= 500) {
            console.error('Server Error:', error.response.data);
            throw new Error('Internal server error on cloud function');
          } else if (error.response.status >= 400) {
            console.warn('Client Error, Ignored:', error.response.data);
          }
        } else {
          console.error('Error sending request:', error.message);
          throw error;
        }
      });
    console.log(res);
  }
}
