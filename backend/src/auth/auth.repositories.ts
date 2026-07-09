import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}
  async findById(id: string): Promise<Auth | null> {
    return this.authRepository.findOne({ where: { id } });
  }
  async findByEmail(email: string): Promise<Auth | null> {
    return this.authRepository.findOne({ where: { email } });
  }
  async findByPhoneNumber(phoneNumber: string): Promise<Auth | null> {
    return this.authRepository.findOne({ where: { phoneNumber } });
  }
  async delete(id: string): Promise<void> {
    await this.authRepository.delete(id);
  }
  async save(
    auth: Omit<Auth, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Auth> {
    return this.authRepository.save(auth);
  }
  async update(id: string, partial: Partial<Auth>): Promise<Auth> {
    const auth = await this.authRepository.findOne({ where: { id } });
    if (!auth) throw new Error('Auth không tồn tại');
    Object.assign(auth, partial);
    return this.authRepository.save(auth);
  }
}
