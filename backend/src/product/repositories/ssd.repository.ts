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
import { Ssd } from '../entities/ssd.entity';
import { SsdFilter } from '../product.type';
import { CreateSsdInput, UpdateSsdInput } from '../dto/ssd.input';

@Injectable()
export class SsdRepository {
  constructor(
    @InjectRepository(Ssd)
    private readonly ssdRepository: Repository<Ssd>,
  ) {}

  async findAll(): Promise<Ssd[]> {
    return this.ssdRepository.find();
  }

  async findById(id: string): Promise<Ssd> {
    const ssd = await this.ssdRepository.findOne({ where: { id } });
    if (!ssd) throw new NotFoundException(`SSD ${id} không tồn tại`);
    return ssd;
  }

  async filter(filter: SsdFilter): Promise<Ssd[]> {
    const where: FindOptionsWhere<Ssd> = {};

    if (filter.name) where.name = ILike(`%${filter.name}%`);
    if (filter.type) where.type = Equal(filter.type);
    if (filter.minCapacity !== undefined && filter.maxCapacity !== undefined)
      where.capacity = Between(filter.minCapacity, filter.maxCapacity);
    if (filter.minReadSpeed !== undefined)
      where.readSpeed = MoreThanOrEqual(filter.minReadSpeed);
    if (filter.minWriteSpeed !== undefined)
      where.writeSpeed = MoreThanOrEqual(filter.minWriteSpeed);
    if (filter.minPrice !== undefined && filter.maxPrice !== undefined)
      where.price = Between(filter.minPrice, filter.maxPrice);
    else if (filter.minPrice !== undefined)
      where.price = MoreThanOrEqual(filter.minPrice);
    else if (filter.maxPrice !== undefined)
      where.price = LessThanOrEqual(filter.maxPrice);

    return this.ssdRepository.find({ where });
  }

  async create(input: CreateSsdInput): Promise<Ssd> {
    const ssd = this.ssdRepository.create(input);
    return this.ssdRepository.save(ssd);
  }

  async update(id: string, input: UpdateSsdInput): Promise<Ssd> {
    const ssd = await this.findById(id);
    Object.assign(ssd, input);
    return this.ssdRepository.save(ssd);
  }

  async remove(id: string): Promise<Ssd> {
    const ssd = await this.findById(id);
    return this.ssdRepository.remove(ssd);
  }
}
