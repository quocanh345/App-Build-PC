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
import { Vga } from '../entities/vga.entity';
import { VgaFilter } from '../product.type';
import { CreateVgaInput, UpdateVgaInput } from '../dto/vga.input';

@Injectable()
export class VgaRepository {
  constructor(
    @InjectRepository(Vga)
    private readonly vgaRepository: Repository<Vga>,
  ) {}

  async findAll(): Promise<Vga[]> {
    return this.vgaRepository.find();
  }

  async findById(id: string): Promise<Vga> {
    const vga = await this.vgaRepository.findOne({ where: { id } });
    if (!vga) throw new NotFoundException(`VGA ${id} không tồn tại`);
    return vga;
  }

  async filter(filter: VgaFilter): Promise<Vga[]> {
    const where: FindOptionsWhere<Vga> = {};

    if (filter.name) where.name = ILike(`%${filter.name}%`);
    if (filter.architecture) where.architecture = Equal(filter.architecture);
    if (filter.minVMemory !== undefined && filter.maxVMemory !== undefined)
      where.vMemory = Between(filter.minVMemory, filter.maxVMemory);
    if (filter.minTgp !== undefined && filter.maxTgp !== undefined)
      where.tgp = Between(filter.minTgp, filter.maxTgp);
    if (filter.minPrice !== undefined && filter.maxPrice !== undefined)
      where.price = Between(filter.minPrice, filter.maxPrice);
    else if (filter.minPrice !== undefined)
      where.price = MoreThanOrEqual(filter.minPrice);
    else if (filter.maxPrice !== undefined)
      where.price = LessThanOrEqual(filter.maxPrice);

    return this.vgaRepository.find({ where });
  }

  async create(input: CreateVgaInput): Promise<Vga> {
    const vga = this.vgaRepository.create(input);
    return this.vgaRepository.save(vga);
  }

  async update(id: string, input: UpdateVgaInput): Promise<Vga> {
    const vga = await this.findById(id);
    Object.assign(vga, input);
    return this.vgaRepository.save(vga);
  }

  async remove(id: string): Promise<Vga> {
    const vga = await this.findById(id);
    return this.vgaRepository.remove(vga);
  }
}
