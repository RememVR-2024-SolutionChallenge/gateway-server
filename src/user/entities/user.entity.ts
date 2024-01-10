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
  @ApiProperty({ description: '유저 아이디(구글OAuth의 경우 지메일)' })
  @PrimaryColumn()
  id: String;

  @ApiProperty({ description: '역할(보호자, 피보호자)' })
  @Column()
  role: 'CareGiver' | 'CareRecipient';

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ example: null, description: '삭제일' })
  @DeleteDateColumn()
  deletedAt: Date | null;
}
