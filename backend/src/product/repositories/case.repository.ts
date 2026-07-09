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
import { Case } from '../entities/case.entity';
import { CaseFilter } from '../product.type';
import { CreateCaseInput, UpdateCaseInput } from '../dto/case.input';

@Injectable()
export class CaseRepository {
  constructor(
    @InjectRepository(Case)
    private readonly caseRepository: Repository<Case>,
  ) {}

  async findAll(): Promise<Case[]> {
    return this.caseRepository.find();
  }

  async findById(id: string): Promise<Case> {
    const item = await this.caseRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Case ${id} không tồn tại`);
    return item;
  }

  async filter(filter: CaseFilter): Promise<Case[]> {
    const where: FindOptionsWhere<Case> = {};

    if (filter.name) where.name = ILike(`%${filter.name}%`);
    if (filter.formFactor) where.formFactor = Equal(filter.formFactor);
    if (filter.minMaxGpuLength !== undefined)
      where.maxGpuLength = MoreThanOrEqual(filter.minMaxGpuLength);
    if (filter.minMaxCoolerHeight !== undefined)
      where.maxCoolerHeight = MoreThanOrEqual(filter.minMaxCoolerHeight);
    if (filter.minPrice !== undefined && filter.maxPrice !== undefined)
      where.price = Between(filter.minPrice, filter.maxPrice);
    else if (filter.minPrice !== undefined)
      where.price = MoreThanOrEqual(filter.minPrice);
    else if (filter.maxPrice !== undefined)
      where.price = LessThanOrEqual(filter.maxPrice);

    return this.caseRepository.find({ where });
  }

  async create(input: CreateCaseInput): Promise<Case> {
    const item = this.caseRepository.create(input);
    return this.caseRepository.save(item);
  }

  async update(id: string, input: UpdateCaseInput): Promise<Case> {
    const item = await this.findById(id);
    Object.assign(item, input);
    return this.caseRepository.save(item);
  }

  async remove(id: string): Promise<Case> {
    const item = await this.findById(id);
    return this.caseRepository.remove(item);
  }
}
