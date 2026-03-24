import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterJobDto } from './dto/filter-job.dto';
import { JobStatus } from './enums/job-status.enum';

@Injectable()
export class JobsService {

  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>
  ) { }

  async create(createJobDto: CreateJobDto, userId: string): Promise<Job> {
    const newJob = this.jobRepository.create({
      ...createJobDto,
      company: { id: userId }
    });
    return this.jobRepository.save(newJob);
  }

  async findAll(filters: FilterJobDto) {
    const { seniority, modality, location, page = 1, limit = 20 } = filters;

    const qb = this.jobRepository
      .createQueryBuilder('job')
      .where('job.status = :status', { status: JobStatus.ACTIVE });

    if (seniority) {
      qb.andWhere('job.seniority = :seniority', { seniority });
    }

    if (modality) {
      qb.andWhere('job.modality = :modality', { modality });
    }

    if (location) {
      qb.andWhere('job.location ILIKE :location', { location: `%${location}%` });
    }

    const skip = (page - 1) * limit;

    const [data, total] = await qb
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Job> {

    const job = await this.jobRepository.findOne({ where: { id }, relations: ['company'] });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return job;
  }

  async update(id: string, userId: string, updateJobDto: UpdateJobDto) {
    const job = await this.findOne(id);

    if (job.company.id !== userId) {
      throw new ForbiddenException();
    }

    Object.assign(job, updateJobDto);
    return this.jobRepository.save(job);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const job = await this.findOne(id);

    if (job.company.id !== userId) {
      throw new ForbiddenException();
    }

    await this.jobRepository.softDelete(id);
    return true;
  }
}
