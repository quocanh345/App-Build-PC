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
import { Cooler } from '../entities/cooler.entity';
import { CoolerFilter } from '../product.type';
import { CreateCoolerInput, UpdateCoolerInput } from '../dto/cooler.input';

@Injectable()
export class CoolerRepository {
  constructor(
    @InjectRepository(Cooler)
    private readonly coolerRepository: Repository<Cooler>,
  ) {}

  async findAll(): Promise<Cooler[]> {
    return this.coolerRepository.find();
  }

  async findById(id: string): Promise<Cooler> {
    const cooler = await this.coolerRepository.findOne({ where: { id } });
    if (!cooler) throw new NotFoundException(`Cooler ${id} không tồn tại`);
    return cooler;
  }

  async filter(filter: CoolerFilter): Promise<Cooler[]> {
    const where: FindOptionsWhere<Cooler> = {};

    if (filter.name) where.name = ILike(`%${filter.name}%`);
    if (filter.type) where.type = Equal(filter.type);
    if (filter.socketSupport) where.socketSupport = Equal(filter.socketSupport);
    if (filter.minSize !== undefined && filter.maxSize !== undefined)
      where.size = Between(filter.minSize, filter.maxSize);
    if (filter.minPrice !== undefined && filter.maxPrice !== undefined)
      where.price = Between(filter.minPrice, filter.maxPrice);
    else if (filter.minPrice !== undefined)
      where.price = MoreThanOrEqual(filter.minPrice);
    else if (filter.maxPrice !== undefined)
      where.price = LessThanOrEqual(filter.maxPrice);

    return this.coolerRepository.find({ where });
  }

  async create(input: CreateCoolerInput): Promise<Cooler> {
    const cooler = this.coolerRepository.create(input);
    return this.coolerRepository.save(cooler);
  }

  async update(id: string, input: UpdateCoolerInput): Promise<Cooler> {
    const cooler = await this.findById(id);
    Object.assign(cooler, input);
    return this.coolerRepository.save(cooler);
  }

  async remove(id: string): Promise<Cooler> {
    const cooler = await this.findById(id);
    return this.coolerRepository.remove(cooler);
  }
}
