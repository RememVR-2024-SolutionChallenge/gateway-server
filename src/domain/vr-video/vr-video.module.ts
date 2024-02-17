import { Module } from '@nestjs/common';
import { GcpModule } from 'src/common/gcp/gcp.module';
import { GroupService } from '../group/group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '../group/entity/group.entity';
import { User } from '../user/entity/user.entity';
import { GroupRepository } from '../group/repository/group.repository';
import { VrVideo } from './entity/vr-video.entity';
import { VrVideoController } from './vr-video.controller';
import { VrResource } from '../vr-resource/entity/vr-resource.entity';
import { VrVideoService } from './service/vr-video.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, User, VrVideo, VrResource]),
    GcpModule,
  ],
  controllers: [VrVideoController],
  providers: [VrVideoService, GroupService, GroupRepository],
})
export class VrVideoModule {}
