import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { FilterJobDto } from './dto/filter-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @Post()
  create(
    @CurrentUser('sub') userId: string,
    @Body() createJobDto: CreateJobDto
  ) {
    return this.jobsService.create(createJobDto, userId);
  }

  @Get()
  findAll(@Query() filters: FilterJobDto) {
    return this.jobsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @Patch(':id')
  update(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto
  ) {
    return this.jobsService.update(id, userId, updateJobDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @Delete(':id')
  remove(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string
  ) {
    return this.jobsService.remove(id, userId);
  }
}
