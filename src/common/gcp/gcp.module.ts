import { Module } from '@nestjs/common';
import { CloudStorageRepository } from './cloud-storage/cloud-storage.repository';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CloudFunctionsRepository } from './cloud-functions/cloud-functions.repository';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [CloudStorageRepository, CloudFunctionsRepository],
  exports: [CloudStorageRepository, CloudFunctionsRepository],
})
export class GcpModule {}
