import { Injectable } from '@nestjs/common';
import { CloudTasksClient, protos } from '@google-cloud/tasks';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudTasksRepository {
  private tasksClient: CloudTasksClient;
  private project: string;
  private location: string;
  private queue: string;

  constructor(private configService: ConfigService) {
    this.tasksClient = new CloudTasksClient({
      keyFilename: this.configService.get<string>('GCP_KEY_FILE'),
    });
    this.project = this.configService.get<string>('GCP_PROJECT');
    this.location = this.configService.get<string>('GCP_LOCATION');
    this.queue = this.configService.get<string>('GCP_QUEUE');
  }

  async createTask(
    uri: string,
    payload: any,
    delaySeconds: number = 0,
  ): Promise<any> {
    const parent = this.tasksClient.queuePath(
      this.project,
      this.location,
      this.queue,
    );

    // 태스크의 HTTP 요청 설정
    const task: protos.google.cloud.tasks.v2.ITask = {
      httpRequest: {
        httpMethod: 'POST',
        url: `https://${uri}`,
        body: Buffer.from(JSON.stringify(payload)).toString('base64'),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      scheduleTime: {
        seconds: delaySeconds + Date.now() / 1000,
      },
    };

    // 태스크 생성
    return await this.tasksClient.createTask({ parent, task });
  }
}
