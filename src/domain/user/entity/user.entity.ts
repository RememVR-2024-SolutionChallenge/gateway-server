import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CareRelation } from './care-relation.entity';

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

  @ApiProperty({ description: '리프레시 토큰', example: 'JWTrefreshToken' })
  @Column({ nullable: true, select: false })
  refreshToken: string | null;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: '삭제일' })
  @DeleteDateColumn()
  deletedAt: Date | null;

  // @ApiProperty({ description: '(본인이 환자인 경우) 본인의 보호자' })
  // @ManyToMany(() => User)
  // @JoinTable({
  //   name: 'care_relation',
  //   joinColumn: { name: 'careRecipientId', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'careGiverId', referencedColumnName: 'id' },
  // })
  // careGivers: User[];

  // @ApiProperty({ description: '(본인이 보호자인 경우) 본인의 피보호자' })
  // @OneToOne(() => User)
  // @JoinTable({
  //   name: 'care_relation',
  //   joinColumn: { name: 'careGiverId', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'careRecipientId', referencedColumnName: 'id' },
  // })
  // careRecipient: User;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'care_relation',
    joinColumn: { name: 'careRecipientId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'careGiverId', referencedColumnName: 'id' },
  })
  careGivers: User[];

  @OneToOne(() => User)
  @JoinColumn({ name: 'careRecipientId' })
  careRecipient: User;
}
