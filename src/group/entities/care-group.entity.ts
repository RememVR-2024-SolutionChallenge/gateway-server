import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'remember_me', name: 'care_group' })
export class CareGroup {
  @ApiProperty({ description: '환자 아이디' })
  @PrimaryColumn()
  careRecipientId: string[];

  @ApiProperty({ description: '보호자 아이디 목록' })
  @
  careGiverIds: string;

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
