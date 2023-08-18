import { ID, Field, ObjectType } from '@nestjs/graphql';
import {
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';
import { ItemsList } from './items-list.entity';
import { User } from 'src/users/user.entity';

@Entity()
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Field()
  @Column()
  todo: string;

  @Field()
  @Column()
  status: ItemStatus;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.items, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @ManyToOne(() => ItemsList, (list) => list.items, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  list?: ItemsList;
}

export enum ItemStatus {
  Todo,
  InProgress,
  Done,
}
