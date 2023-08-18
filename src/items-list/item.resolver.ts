import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ItemService } from './item.service';
import { Item } from './item.entity';
import { CreateItemInput } from './dto/createItemInput';
import { UpdateItemInput } from './dto/updateItemInput';

@Resolver('Item')
export class ItemResolver {
  constructor(private itemService: ItemService) {}

  @Query(() => [Item])
  async findItemsByListId(
    @Args('ownerId') ownerId: string,
    @Args('listId', { nullable: true }) listId?: string,
  ): Promise<Item[]> {
    return await this.itemService.findItemsByListId(ownerId, listId);
  }

  @Mutation(() => Item)
  async createItem(@Args('itemData') itemData: CreateItemInput): Promise<Item> {
    return await this.itemService.create(itemData);
  }

  @Mutation(() => Item)
  async updateItem(
    @Args('ownerId') ownerId: string,
    @Args('itemId') itemId: string,
    @Args('itemData') itemData: UpdateItemInput,
  ): Promise<Item> {
    return await this.itemService.update(ownerId, itemId, itemData);
  }

  @Mutation(() => Boolean)
  async removeItem(
    @Args('ownerId') ownerId: string,
    @Args('itemId') itemId: string,
  ): Promise<boolean> {
    await this.itemService.remove(ownerId, itemId);
    return true;
  }
}
