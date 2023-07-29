import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemsList } from './items-list.entity';
import { Repository } from 'typeorm';
import { CreateItemsListInput } from './dto/createItemsListInput';
import { UsersService } from 'src/users/users.service';
import { UpdateItemsListInput } from './dto/updateItemsListInput';

@Injectable()
export class ItemsListService {
  constructor(
    @InjectRepository(ItemsList)
    private itemsListRepository: Repository<ItemsList>,
    private usersService: UsersService,
  ) {}

  async create(listData: CreateItemsListInput): Promise<ItemsList> {
    const owner = await this.usersService.findUserById(listData.ownerId);

    const formedItemsList = await this.itemsListRepository.create({
      name: listData.name,
      description: listData.description,
      owner,
    });

    return this.itemsListRepository.save(formedItemsList);
  }

  async findUserLists(userId: string): Promise<ItemsList[]> {
    return await this.itemsListRepository.find({
      where: { owner: { id: userId } },
    });
  }

  async findList(userId: string, listId: string): Promise<ItemsList> {
    const foundList = await this.itemsListRepository.findOne({
      where: { id: listId, owner: { id: userId } },
    });

    if (!foundList) {
      throw new NotFoundException('List not found');
    }

    return foundList;
  }

  async update(userId: string, listId: string, listData: UpdateItemsListInput) {
    const foundList = await this.findList(userId, listId);

    if (!foundList) throw new NotFoundException('List not found');

    const editedList = await this.itemsListRepository.save({
      ...foundList,
      ...listData,
    });

    return await this.itemsListRepository.save(editedList);
  }
}
