import { ApiProperty } from '@nestjs/swagger';
import { Group } from 'src/domain/group/entity/group.entity';
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
  Column,
  ManyToOne,
} from 'typeorm';

@Entity({ schema: 'remember_me', name: 'badge' })
export class Badge {
  @ApiProperty({ description: '뱃지 아이디' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '뱃지 종류(랜덤으로 부여)',
    enum: ['GREAT_JOB', 'EXCELLENT_WORK', 'LOVELY'],
  })
  @Column()
  type: 'GREAT_JOB' | 'EXCELLENT_WORK' | 'LOVELY';

  @ApiProperty({ description: '뱃지 부여일' })
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => Group, (group) => group.badges, { onDelete: 'CASCADE' })
  group: Group;
}
