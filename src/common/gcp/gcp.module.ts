import { Module } from '@nestjs/common';
import { CloudStorageRepository } from './cloud-storage/cloud-storage.repository';
import { CloudTasksRepository } from './cloud-tasks/cloud-tasks.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [CloudStorageRepository, CloudTasksRepository],
  exports: [CloudStorageRepository, CloudTasksRepository],
})
export class GcpModule {}
