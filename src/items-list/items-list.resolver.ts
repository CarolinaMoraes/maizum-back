import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { ItemsList } from './items-list.entity';
import { CreateItemsListInput } from './dto/createItemsListInput';
import { ItemsListService } from './items-list.service';
import { UpdateItemsListInput } from './dto/updateItemsListInput';

@Resolver('ItemsList')
export class ItemsListResolver {
  constructor(private itemsListService: ItemsListService) {}

  @Query(() => [ItemsList])
  async findUserLists(@Args('userId') userId: string): Promise<ItemsList[]> {
    return await this.itemsListService.findUserLists(userId);
  }

  @Query(() => ItemsList)
  async findList(
    @Args('userId') userId: string,
    @Args('listId') listId: string,
  ): Promise<ItemsList> {
    return await this.itemsListService.findList(userId, listId);
  }

  @Mutation(() => ItemsList)
  async createList(
    @Args('createListData') createListData: CreateItemsListInput,
  ): Promise<ItemsList> {
    return await this.itemsListService.create(createListData);
  }

  @Mutation(() => ItemsList)
  async updateList(
    @Args('listId') listId: string,
    @Args('userId') userId: string,
    @Args('updateListData') updateListData: UpdateItemsListInput,
  ): Promise<ItemsList> {
    return await this.itemsListService.update(userId, listId, updateListData);
  }

  @Mutation(() => Boolean)
  async removeList(listId: string, userId: string): Promise<boolean> {
    await this.itemsListService.remove(userId, listId);
    return true;
  }
}
