import { Module } from '@nestjs/common';
import { GcpModule } from 'src/common/gcp/gcp.module';
import { SampleController } from './sample.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleVrResourceService } from './service/sample-vr-resource.service';
import { SampleVrResourceRepository } from './repository/sample-vr-resource.repository';
import { SampleVrResource } from './entity/sample-vr-resource.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SampleVrResource]), GcpModule],
  controllers: [SampleController],
  providers: [SampleVrResourceService, SampleVrResourceRepository],
  exports: [SampleVrResourceService],
})
export class SampleModule {}
