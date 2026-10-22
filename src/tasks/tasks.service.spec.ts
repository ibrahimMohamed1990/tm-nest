import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  const repo = {
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const mod = await Test.createTestingModule({
      providers: [TasksService, { provide: getRepositoryToken(Task), useValue: repo }],
    }).compile();
    service = mod.get(TasksService);
  });

  it('throws NotFound when task is missing', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.findOne(1, 99)).rejects.toThrow(NotFoundException);
  });

  it('returns the task when it exists', async () => {
    repo.findOne.mockResolvedValue({ id: 5, title: 'x' });
    await expect(service.findOne(1, 5)).resolves.toEqual({ id: 5, title: 'x' });
  });

  it('paginates with skip/take', async () => {
    repo.findAndCount.mockResolvedValue([[], 0]);
    await service.findAll(1, { page: 3, limit: 10 });
    expect(repo.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 20, take: 10 }),
    );
  });
});
