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
import { Psu } from '../entities/psu.entity';
import { PsuFilter } from '../product.type';
import { CreatePsuInput, UpdatePsuInput } from '../dto/psu.input';

@Injectable()
export class PsuRepository {
  constructor(
    @InjectRepository(Psu)
    private readonly psuRepository: Repository<Psu>,
  ) {}

  async findAll(): Promise<Psu[]> {
    return this.psuRepository.find();
  }

  async findById(id: string): Promise<Psu> {
    const psu = await this.psuRepository.findOne({ where: { id } });
    if (!psu) throw new NotFoundException(`PSU ${id} không tồn tại`);
    return psu;
  }

  async filter(filter: PsuFilter): Promise<Psu[]> {
    const where: FindOptionsWhere<Psu> = {};

    if (filter.name) where.name = ILike(`%${filter.name}%`);
    if (filter.efficiency) where.efficiency = Equal(filter.efficiency);
    if (filter.modular) where.modular = Equal(filter.modular);
    if (filter.minWattage !== undefined && filter.maxWattage !== undefined)
      where.wattage = Between(filter.minWattage, filter.maxWattage);
    if (filter.minPrice !== undefined && filter.maxPrice !== undefined)
      where.price = Between(filter.minPrice, filter.maxPrice);
    else if (filter.minPrice !== undefined)
      where.price = MoreThanOrEqual(filter.minPrice);
    else if (filter.maxPrice !== undefined)
      where.price = LessThanOrEqual(filter.maxPrice);

    return this.psuRepository.find({ where });
  }

  async create(input: CreatePsuInput): Promise<Psu> {
    const psu = this.psuRepository.create(input);
    return this.psuRepository.save(psu);
  }

  async update(id: string, input: UpdatePsuInput): Promise<Psu> {
    const psu = await this.findById(id);
    Object.assign(psu, input);
    return this.psuRepository.save(psu);
  }

  async remove(id: string): Promise<Psu> {
    const psu = await this.findById(id);
    return this.psuRepository.remove(psu);
  }
}
