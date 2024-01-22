import { Module } from '@nestjs/common';
import { CloudStorageRepository } from './cloud-storage/cloud-storage.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [CloudStorageRepository],
  exports: [CloudStorageRepository],
})
export class GcpModule {}
