import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Group } from '../../group/entity/group.entity';

@Entity({ schema: 'remember_me', name: 'user' })
export class User {
  @ApiProperty({
    description: '유저 구분 아이디',
    example: 'exampleuserid1234',
  })
  @PrimaryColumn({})
  id: string;

  @ApiProperty({
    description: '이메일(구글OAuth의 경우 지메일)',
    example: 'example@gmail.com',
  })
  @Column()
  email: string;

  @ApiProperty({ description: '이름, 닉네임(displayName)', example: 'woo' })
  @Column()
  name: string;

  @ApiProperty({ description: '역할(보호자, 피보호자)', example: 'CareGiver' })
  @Column({ nullable: true })
  role: 'CareGiver' | 'CareRecipient' | null;

  @ApiProperty({ description: '최초 정보 등록 여부', example: 'true' })
  @Column({ default: false })
  isEnrolled: boolean;

  @ApiProperty({
    description: '소속 그룹(보호자의 경우)',
  })
  @ManyToOne(() => Group, (group) => group.givers)
  groupAsGiver: Group;

  @ApiProperty({
    description: '소속 그룹(환자의 경우)',
  })
  @OneToOne(() => Group, (group) => group.recipient)
  groupAsRecipient: Group;

  @ApiProperty({ description: '리프레시 토큰', example: 'JWTrefreshToken' })
  @Column({ nullable: true, select: false })
  refreshToken: string | null;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ApiProperty({ description: '삭제일' })
  @DeleteDateColumn({ select: false })
  deletedAt: Date | null;
}
