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
    @Args('updateListData') updateListData: UpdateItemsListInput,
    @Args('userId') userId: string,
  ): Promise<ItemsList> {
    return await this.itemsListService.update(userId, listId, updateListData);
  }
}
