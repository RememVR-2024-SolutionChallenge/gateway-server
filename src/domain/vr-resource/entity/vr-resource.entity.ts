import { ApiProperty } from '@nestjs/swagger';
import { Group } from 'src/domain/group/entity/group.entity';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity({ schema: 'remember_me', name: 'vr_resource' })
export class VrResource {
  @ApiProperty({ description: 'VR 리소스 아이디' })
  @PrimaryColumn()
  id: string;

  @ApiProperty({ description: 'VR 리소스 제목' })
  @Column()
  title: string;

  @ApiProperty({ description: 'VR 리소스 위치 (Cloud Storage 내에서)' })
  @Column()
  filePath: string;

  @ApiProperty({
    description: '타입 (아바타, 배경)',
    enum: ['avatar', 'scene'],
  })
  @Column()
  type: 'avatar' | 'scene';

  @ApiProperty({ description: 'VR 리소스 생성일' })
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => Group, (group) => group.badges, { onDelete: 'CASCADE' })
  group: Group;
}
