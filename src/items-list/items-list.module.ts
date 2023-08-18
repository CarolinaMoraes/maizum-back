import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { ItemsListResolver } from './items-list.resolver';
import { ItemsListService } from './items-list.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsList } from './items-list.entity';
import { Item } from './item.entity';
import { ItemResolver } from './item.resolver';
import { ItemService } from './item.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([ItemsList, Item])],
  providers: [ItemsListResolver, ItemsListService, ItemResolver, ItemService],
})
export class ItemsListModule {}
