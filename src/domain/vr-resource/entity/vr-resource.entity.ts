import { ApiProperty } from '@nestjs/swagger';
import { Group } from 'src/domain/group/entity/group.entity';
import { VrVideo } from 'src/domain/vr-video/entity/vr-video.entity';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  ManyToOne,
  PrimaryColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

@Entity({ schema: 'remember_me', name: 'vr_resource' })
export class VrResource {
  @ApiProperty({
    description:
      'VR 리소스 아이디(로컬에서 다운로드 받을 때, 중복검사 등으로 이용가능)',
    example: '123',
  })
  @PrimaryColumn()
  id: string;

  @ApiProperty({ description: 'VR 리소스 제목', example: '아들 아바타' })
  @Column()
  title: string;

  @ApiProperty({
    description: 'VR 리소스 위치 (Cloud Storage 내의 폴더 위치, 파일 아님.)',
    example: 'to/file/',
  })
  @Column()
  filePath: string;

  @ApiProperty({
    description: '타입 (아바타, 배경)',
    enum: ['avatar', 'scene'],
    example: 'avatar',
  })
  @Column()
  type: 'avatar' | 'scene';

  @ApiProperty({
    description: 'VR 리소스 생성일',
    example: '2021-09-23T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => Group, (group) => group.badges, { onDelete: 'CASCADE' })
  group: Group;

  @OneToMany(() => VrVideo, (vrVideo) => vrVideo.scene)
  vrVideosAsScene: VrVideo[];

  @ManyToMany(() => VrVideo, (vrVideo) => vrVideo.avatars)
  vrVideosAsAvatar: VrVideo[];
}
