import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { ItemsListResolver } from './items-list.resolver';
import { ItemsListService } from './items-list.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsList } from './items-list.entity';
import { Item } from './item.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([ItemsList, Item])],
  providers: [ItemsListResolver, ItemsListService],
})
export class ItemsListModule {}
