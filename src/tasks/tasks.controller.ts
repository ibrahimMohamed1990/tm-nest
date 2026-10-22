import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private tasks: TasksService) {}

  @Get()
  findAll(@CurrentUser() user, @Query() q: QueryTaskDto) {
    return this.tasks.findAll(user.id, q);
  }

  @Get(':id')
  findOne(@CurrentUser() user, @Param('id', ParseIntPipe) id: number) {
    return this.tasks.findOne(user.id, id);
  }

  @Post()
  create(@CurrentUser() user, @Body() dto: CreateTaskDto) {
    return this.tasks.create(user.id, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasks.update(user.id, id, dto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@CurrentUser() user, @Param('id', ParseIntPipe) id: number) {
    return this.tasks.remove(user.id, id);
  }
}
