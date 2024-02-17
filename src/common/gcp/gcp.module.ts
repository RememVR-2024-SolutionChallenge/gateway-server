import { Module } from '@nestjs/common';
import { VrResourceStorageRepository } from './cloud-storage/vr-resource-storage.repository';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CloudFunctionsRepository } from './cloud-functions/cloud-functions.repository';
import { VrVideoStorageRepository } from './cloud-storage/vr-video-storage.repository';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [
    VrResourceStorageRepository,
    CloudFunctionsRepository,
    VrVideoStorageRepository,
  ],
  exports: [
    VrResourceStorageRepository,
    CloudFunctionsRepository,
    VrVideoStorageRepository,
  ],
})
export class GcpModule {}
