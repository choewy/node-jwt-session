import { Todo, TodoItem } from '@/core';
import { Injectable } from '@nestjs/common';
import { DataSource, InsertResult, IsNull, Repository } from 'typeorm';

@Injectable()
export class TodoRepository {
  private readonly todoRepo: Repository<Todo>;
  private readonly itemRepo: Repository<TodoItem>;

  constructor(private readonly dataSource: DataSource) {
    this.todoRepo = this.dataSource.getRepository(Todo);
    this.itemRepo = this.dataSource.getRepository(TodoItem);
  }

  async findByUserId(userId: number): Promise<Todo[]> {
    return this.todoRepo.find({
      where: {
        user: { id: userId },
        deletedAt: IsNull(),
      },
    });
  }

  async findByUserAndId(userId: number, todoId: number): Promise<Todo> {
    return this.todoRepo.findOne({
      where: {
        id: todoId,
        user: { id: userId },
        deletedAt: IsNull(),
      },
    });
  }

  async findItemsByTodoId(todoId: number): Promise<TodoItem[]> {
    return this.itemRepo.find({
      where: {
        todo: { id: todoId },
        deletedAt: IsNull(),
      },
    });
  }

  async insert(todo: Partial<Todo>): Promise<InsertResult> {
    return this.todoRepo.insert(todo);
  }

  async insertItem(item: Partial<TodoItem>): Promise<InsertResult> {
    return this.itemRepo.insert(item);
  }
}
