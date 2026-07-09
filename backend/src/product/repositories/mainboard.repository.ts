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
import { Mainboard } from '../entities/mainboard.entity';
import { MainboardFilter } from '../product.type';
import {
  CreateMainboardInput,
  UpdateMainboardInput,
} from '../dto/mainboard.input';

@Injectable()
export class MainboardRepository {
  constructor(
    @InjectRepository(Mainboard)
    private readonly mainboardRepository: Repository<Mainboard>,
  ) {}

  async findAll(): Promise<Mainboard[]> {
    return this.mainboardRepository.find();
  }

  async findById(id: string): Promise<Mainboard> {
    const mainboard = await this.mainboardRepository.findOne({ where: { id } });
    if (!mainboard)
      throw new NotFoundException(`Mainboard ${id} không tồn tại`);
    return mainboard;
  }

  async filter(filter: MainboardFilter): Promise<Mainboard[]> {
    const where: FindOptionsWhere<Mainboard> = {};

    if (filter.name) where.name = ILike(`%${filter.name}%`);
    if (filter.socket) where.socket = Equal(filter.socket);
    if (filter.chipset) where.chipset = Equal(filter.chipset);
    if (filter.formFactor) where.formFactor = Equal(filter.formFactor);
    if (filter.memoryType) where.memoryType = Equal(filter.memoryType);
    if (filter.minPrice !== undefined && filter.maxPrice !== undefined)
      where.price = Between(filter.minPrice, filter.maxPrice);
    else if (filter.minPrice !== undefined)
      where.price = MoreThanOrEqual(filter.minPrice);
    else if (filter.maxPrice !== undefined)
      where.price = LessThanOrEqual(filter.maxPrice);

    return this.mainboardRepository.find({ where });
  }

  async create(input: CreateMainboardInput): Promise<Mainboard> {
    const mainboard = this.mainboardRepository.create(input);
    return this.mainboardRepository.save(mainboard);
  }

  async update(id: string, input: UpdateMainboardInput): Promise<Mainboard> {
    const mainboard = await this.findById(id);
    Object.assign(mainboard, input);
    return this.mainboardRepository.save(mainboard);
  }

  async remove(id: string): Promise<Mainboard> {
    const mainboard = await this.findById(id);
    return this.mainboardRepository.remove(mainboard);
  }
}
