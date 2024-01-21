import { Injectable } from '@nestjs/common';
import { CloudTasksRepository } from './cloud-tasks.repository';

@Injectable()
export class CloudTasksService {
  constructor(private readonly cloudTasksRepository: CloudTasksRepository) {}
}
