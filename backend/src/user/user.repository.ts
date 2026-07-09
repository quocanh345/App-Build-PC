import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async getOrCreate(id: string): Promise<User> {
    const existing = await this.findById(id);
    if (existing) return existing;
    const user = this.userRepository.create({ id, username: '', address: '' });
    return this.userRepository.save(user);
  }

  async update(
    id: string,
    partial: Partial<Pick<User, 'username' | 'address'>>,
  ): Promise<User> {
    const user = await this.getOrCreate(id);
    Object.assign(user, partial);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
