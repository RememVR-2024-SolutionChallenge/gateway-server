import { ApiProperty } from '@nestjs/swagger';
import { Group } from 'src/domain/group/entity/group.entity';
import { VrResource } from 'src/domain/vr-resource/entity/vr-resource.entity';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  ManyToOne,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity({ schema: 'remember_me', name: 'vr_video' })
export class VrVideo {
  @ApiProperty({
    description:
      'VR 비디오 아이디(로컬에서 다운로드 받을 때, 중복검사 등으로 이용가능)',
    example: '123',
  })
  @PrimaryColumn()
  id: string;

  @ApiProperty({ description: 'VR 비디오 제목', example: '아들 대학 졸업식' })
  @Column()
  title: string;

  @ApiProperty({
    description: '샘플 여부',
    example: false,
  })
  @Column()
  isSample: boolean;

  @ManyToOne(() => Group, (group) => group.badges, { onDelete: 'CASCADE' })
  group: Group;

  @ManyToOne(() => VrResource, (vrResource) => vrResource.vrVideosAsScene, {
    onDelete: 'CASCADE',
  })
  scene: VrResource;

  @ManyToMany(() => VrResource, (vrResource) => vrResource.vrVideosAsAvatar, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'vr_video_avatars',
    joinColumn: {
      name: 'vrVideoId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'vrResourceId',
      referencedColumnName: 'id',
    },
  })
  avatars: VrResource[];

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
}
