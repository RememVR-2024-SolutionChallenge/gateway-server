import { StringLiteral } from '@babel/types';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'remember_me', name: 'user' })
export class User {
  @ApiProperty({ description: '유저 구분 아이디' })
  @PrimaryColumn()
  id: string;

  @ApiProperty({ description: '이메일(구글OAuth의 경우 지메일)' })
  @Column()
  email: string;

  @ApiProperty({ description: '이름, 닉네임(displayName)' })
  @Column()
  name: string;

  @ApiProperty({ description: '역할(보호자, 피보호자)' })
  @Column({ nullable: true })
  role: 'CareGiver' | 'CareRecipient';

  @ApiProperty({ description: '리프레시 토큰' })
  @Column({ nullable: true })
  refreshToken: string;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: '삭제일' })
  @DeleteDateColumn()
  deletedAt: Date | null;
}
