import { ID, Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/user.entity';
import {
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
  CreateDateColumn,
  Entity,
} from 'typeorm';
import { Item } from './item.entity';

@Entity()
@ObjectType()
export class ItemsList {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => User, (owner) => owner.lists, { onDelete: 'CASCADE' })
  @Field((type) => User)
  owner: User;

  @OneToMany(() => Item, (item) => item.list)
  @Field((type) => [Item], { nullable: true })
  items?: Item[];
}
