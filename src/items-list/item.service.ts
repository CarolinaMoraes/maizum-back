import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { UsersService } from 'src/users/users.service';
import { ItemsListService } from './items-list.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/createItemInput';
import { UpdateItemInput } from './dto/updateItemInput';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    private usersService: UsersService,
    private itemsListService: ItemsListService,
  ) {}

  async create(itemData: CreateItemInput): Promise<Item> {
    const owner = await this.usersService.findUserById(itemData.ownerId);

    let list = null;

    if (itemData.listId) {
      list = await this.itemsListService.findList(owner.id, itemData.listId);
    }

    const formedItem = await this.itemRepository.create({
      list,
      owner,
      todo: itemData.todo,
      status: itemData.status,
    });

    return this.itemRepository.save(formedItem);
  }

  async findItemsByListId(ownerId: string, listId?: string): Promise<Item[]> {
    return await this.itemRepository.find({
      where: { list: { id: listId }, owner: { id: ownerId } },
    });
  }

  async update(
    ownerId: string,
    itemId: string,
    itemData: UpdateItemInput,
  ): Promise<Item> {
    const foundItem = await this.itemRepository.findOne({
      where: { id: itemId, owner: { id: ownerId } },
    });

    if (!foundItem) {
      throw new NotFoundException("Item doesn't exist");
    }

    return await this.itemRepository.save({
      ...foundItem,
      ...itemData,
    });
  }

  async remove(ownerId: string, itemId: string): Promise<void> {
    await this.itemRepository.delete({ id: itemId, owner: { id: ownerId } });
  }
}
