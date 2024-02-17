import { ApiProperty } from '@nestjs/swagger';
import { Badge } from 'src/domain/badge/entity/badge.entity';
import { User } from 'src/domain/user/entity/user.entity';
import { VrResource } from 'src/domain/vr-resource/entity/vr-resource.entity';
import { VrVideo } from 'src/domain/vr-video/entity/vr-video.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity({ schema: 'remember_me', name: 'group' })
export class Group {
  @ApiProperty({ description: '그룹 아이디(환자의 유저 아이디에서 차용)' })
  @PrimaryColumn()
  id: string;

  @ApiProperty({ description: '환자 정보' })
  @OneToOne(() => User, (user) => user.groupAsRecipient)
  @JoinColumn()
  recipient: User;

  @ApiProperty({ description: '보호자 정보 목록' })
  @OneToMany(() => User, (user) => user.groupAsGiver)
  givers: User[];

  @ApiProperty({ description: '뱃지 목록' })
  @OneToMany(() => Badge, (badge) => badge.group)
  badges: Badge[];

  @ApiProperty({ description: 'VR 비디오 목록' })
  @OneToMany(() => VrVideo, (vrVideo) => vrVideo.group)
  vrVideos: VrVideo[];

  @ApiProperty({ description: 'VR 리소스 목록' })
  @OneToMany(() => VrResource, (vrResoucre) => vrResoucre.group)
  vrResources: VrResource[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
