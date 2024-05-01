import { Module } from '@nestjs/common';
import { GcpModule } from 'src/common/gcp/gcp.module';
import { SampleController } from './sample.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VrResource } from '../vr-resource/entity/vr-resource.entity';
import { VrResourceModule } from '../vr-resource/vr-resource.module';
import { VrVideo } from '../vr-video/entity/vr-video.entity';
import { VrVideoModule } from '../vr-video/vr-video.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VrResource, VrVideo]),
    VrResourceModule,
    VrVideoModule,
    GcpModule,
  ],
  controllers: [SampleController],
})
export class SampleModule {}
