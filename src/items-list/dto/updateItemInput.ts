import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateItemInput } from './createItemInput';

@InputType()
export class UpdateItemInput extends PartialType(
  OmitType(CreateItemInput, ['ownerId']),
) {}
