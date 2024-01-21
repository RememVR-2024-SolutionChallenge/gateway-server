import { Module } from '@nestjs/common';
import { CloudStorageService } from './cloud-storage/cloud-storage.service';
import { CloudStorageRepository } from './cloud-storage/cloud-storage.repository';
import { CloudTasksService } from './cloud-tasks/cloud-tasks.service';
import { CloudTasksRepository } from './cloud-tasks/cloud-tasks.repository';

@Module({
  imports: [],
  providers: [
    CloudStorageService,
    CloudStorageRepository,
    CloudTasksService,
    CloudTasksRepository,
  ],
  exports: [CloudStorageService, CloudTasksService],
})
export class GcpModule {}
