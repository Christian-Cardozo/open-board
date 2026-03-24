import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from 'typeorm';
import { JobStatus } from '../enums/job-status.enum';
import { JobSeniority } from '../enums/job-seniority.enum';
import { JobModality } from '../enums/job-modality.enum';

@Entity('jobs')
export class Job {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column('simple-array')
    requirements: string[];

    @Column('simple-array')
    stack: string[];

    @Column({ type: 'enum', enum: JobModality })
    modality: JobModality;

    @Column()
    salary: string;

    @Column({ type: 'enum', enum: JobStatus, default: JobStatus.ACTIVE })
    status: JobStatus;

    @Column({ type: 'enum', enum: JobSeniority })
    seniority: JobSeniority;

    @Column()
    location: string;

    @ManyToOne(() => User, user => user.jobs)
    company: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}

