import { Module } from '@nestjs/common';
import { GcpModule } from 'src/common/gcp/gcp.module';
import { GroupService } from '../group/service/group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '../group/entity/group.entity';
import { User } from '../user/entity/user.entity';
import { GroupRepository } from '../group/repository/group.repository';
import { VrVideo } from './entity/vr-video.entity';
import { VrVideoController } from './vr-video.controller';
import { VrResource } from '../vr-resource/entity/vr-resource.entity';
import { VrVideoService } from './service/vr-video.service';
import { VrResourceRepository } from '../vr-resource/repository/vr-resource.repository';
import { VrVideoRepository } from './repository/vr-video.repository';
import { GroupModule } from '../group/group.module';
import { VrResourceModule } from '../vr-resource/vr-resource.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, User, VrVideo, VrResource]),
    GcpModule,
    GroupModule,
    VrResourceModule,
  ],
  controllers: [VrVideoController],
  providers: [VrVideoService, VrVideoRepository],
  exports: [VrVideoService],
})
export class VrVideoModule {}
