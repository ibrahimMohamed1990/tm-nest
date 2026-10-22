import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private repo: Repository<Task>) {}

  async findAll(userId: number, q: QueryTaskDto) {
    const [items, total] = await this.repo.findAndCount({
      where: { owner: { id: userId }, ...(q.status && { status: q.status }) },
      order: { createdAt: 'DESC' },
      skip: (q.page - 1) * q.limit,
      take: q.limit,
    });
    return { items, total, page: q.page, limit: q.limit };
  }

  async findOne(userId: number, id: number) {
    const task = await this.repo.findOne({ where: { id, owner: { id: userId } } });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  create(userId: number, dto: CreateTaskDto) {
    return this.repo.save(this.repo.create({ ...dto, owner: { id: userId } }));
  }

  async update(userId: number, id: number, dto: UpdateTaskDto) {
    const task = await this.findOne(userId, id);
    return this.repo.save(Object.assign(task, dto));
  }

  async remove(userId: number, id: number) {
    const task = await this.findOne(userId, id);
    await this.repo.remove(task);
  }
}
