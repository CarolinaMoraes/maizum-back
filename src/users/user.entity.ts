import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Item } from 'src/items-list/item.entity';
import { ItemsList } from 'src/items-list/items-list.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @HideField()
  @Column()
  password: string;

  @OneToMany(() => ItemsList, (itemsList) => itemsList.owner)
  @Field((type) => [ItemsList], { nullable: true })
  lists?: ItemsList[];

  @OneToMany(() => Item, (item) => item.owner)
  @Field((type) => [ItemsList], { nullable: true })
  items?: Item[];
}
