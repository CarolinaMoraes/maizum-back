import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ItemStatus } from '../item.entity';

@InputType()
export class CreateItemInput {
  @IsString()
  @Field()
  @IsNotEmpty()
  todo: string;

  @IsEnum(ItemStatus)
  @Field()
  status: ItemStatus;

  @IsUUID()
  @Field()
  ownerId: string;

  @IsUUID()
  @IsOptional()
  @Field({ nullable: true })
  listId: string;
}
