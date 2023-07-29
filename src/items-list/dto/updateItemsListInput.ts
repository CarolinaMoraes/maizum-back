import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateItemsListInput } from './createItemsListInput';

@InputType()
export class UpdateItemsListInput extends PartialType(
  OmitType(CreateItemsListInput, ['ownerId']),
) {}
