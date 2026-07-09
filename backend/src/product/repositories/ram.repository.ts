import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsWhere,
  Between,
  ILike,
  Equal,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { Ram } from '../entities/ram.entity';
import { RamFilter } from '../product.type';
import { CreateRamInput, UpdateRamInput } from '../dto/ram.input';

@Injectable()
export class RamRepository {
  constructor(
    @InjectRepository(Ram)
    private readonly ramRepository: Repository<Ram>,
  ) {}

  async findAll(): Promise<Ram[]> {
    return this.ramRepository.find();
  }

  async findById(id: string): Promise<Ram> {
    const ram = await this.ramRepository.findOne({ where: { id } });
    if (!ram) throw new NotFoundException(`RAM ${id} không tồn tại`);
    return ram;
  }

  async filter(filter: RamFilter): Promise<Ram[]> {
    const where: FindOptionsWhere<Ram> = {};

    if (filter.name) where.name = ILike(`%${filter.name}%`);
    if (filter.standard) where.standard = Equal(filter.standard);
    if (filter.latency) where.latency = Equal(filter.latency);
    if (filter.minBus !== undefined && filter.maxBus !== undefined)
      where.bus = Between(filter.minBus, filter.maxBus);
    if (filter.minMemory !== undefined && filter.maxMemory !== undefined)
      where.memory = Between(filter.minMemory, filter.maxMemory);
    if (filter.minPrice !== undefined && filter.maxPrice !== undefined)
      where.price = Between(filter.minPrice, filter.maxPrice);
    else if (filter.minPrice !== undefined)
      where.price = MoreThanOrEqual(filter.minPrice);
    else if (filter.maxPrice !== undefined)
      where.price = LessThanOrEqual(filter.maxPrice);

    return this.ramRepository.find({ where });
  }

  async create(input: CreateRamInput): Promise<Ram> {
    const ram = this.ramRepository.create(input);
    return this.ramRepository.save(ram);
  }

  async update(id: string, input: UpdateRamInput): Promise<Ram> {
    const ram = await this.findById(id);
    Object.assign(ram, input);
    return this.ramRepository.save(ram);
  }

  async remove(id: string): Promise<Ram> {
    const ram = await this.findById(id);
    return this.ramRepository.remove(ram);
  }
}
