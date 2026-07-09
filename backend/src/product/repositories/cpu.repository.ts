import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsWhere,
  Between,
  ILike,
  Equal,
  Not,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { Cpu } from '../entities/cpu.entity';
import { CpuFilter } from '../product.type';
import { CreateCpuInput, UpdateCpuInput } from '../dto/cpu.input';

@Injectable()
export class CpuRepository {
  constructor(
    @InjectRepository(Cpu)
    private readonly cpuRepository: Repository<Cpu>,
  ) {}

  async findAll(): Promise<Cpu[]> {
    return this.cpuRepository.find();
  }

  async findById(id: string): Promise<Cpu> {
    const cpu = await this.cpuRepository.findOne({ where: { id } });
    if (!cpu) throw new NotFoundException(`CPU ${id} không tồn tại`);
    return cpu;
  }

  async filter(filter: CpuFilter): Promise<Cpu[]> {
    const where: FindOptionsWhere<Cpu> = {};

    if (filter.name) where.name = ILike(`%${filter.name}%`);
    if (filter.socket) where.socket = Equal(filter.socket);
    if (filter.minCore !== undefined && filter.maxCore !== undefined)
      where.cores = Between(filter.minCore, filter.maxCore);
    if (filter.minFrequency !== undefined && filter.maxFrequency !== undefined)
      where.frequency = Between(filter.minFrequency, filter.maxFrequency);
    if (filter.minCache !== undefined && filter.maxCache !== undefined)
      where.cache = Between(filter.minCache, filter.maxCache);
    if (filter.iGPU !== undefined)
      where.iGPU = filter.iGPU ? Not(Equal('')) : Equal('');
    if (filter.minPrice !== undefined && filter.maxPrice !== undefined)
      where.price = Between(filter.minPrice, filter.maxPrice);
    else if (filter.minPrice !== undefined)
      where.price = MoreThanOrEqual(filter.minPrice);
    else if (filter.maxPrice !== undefined)
      where.price = LessThanOrEqual(filter.maxPrice);

    return this.cpuRepository.find({ where });
  }

  async create(input: CreateCpuInput): Promise<Cpu> {
    const cpu = this.cpuRepository.create(input);
    return this.cpuRepository.save(cpu);
  }

  async update(id: string, input: UpdateCpuInput): Promise<Cpu> {
    const cpu = await this.findById(id);
    Object.assign(cpu, input);
    return this.cpuRepository.save(cpu);
  }

  async remove(id: string): Promise<Cpu> {
    const cpu = await this.findById(id);
    return this.cpuRepository.remove(cpu);
  }
}
