import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RefreshTokenWrapper {
  @PrimaryGeneratedColumn('uuid')
  refreshToken: string;

  @Column()
  userId: string;

  @Column()
  isValid: boolean;

  @CreateDateColumn()
  issuedAt: Date;

  @Column({
    type: 'timestamp',
    default: () => `NOW() + INTERVAL '15 days'`,
  })
  expiresAt: Date;
}
