import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Complaint } from './entities/complaint.entity';
import { ComplaintStatus } from './complaint-status.enum';
import { CreateComplaintInput } from './dto/create-complaint.input';

@Injectable()
export class ComplaintRepository {
  constructor(
    @InjectRepository(Complaint)
    private readonly complaintRepository: Repository<Complaint>,
  ) {}

  async findByUser(userId: string): Promise<Complaint[]> {
    return this.complaintRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByOrder(orderId: string): Promise<Complaint[]> {
    return this.complaintRepository.find({
      where: { orderId },
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<Complaint[]> {
    return this.complaintRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Complaint | null> {
    return this.complaintRepository.findOne({ where: { id } });
  }

  async create(
    userId: string,
    input: CreateComplaintInput,
  ): Promise<Complaint> {
    const complaint = this.complaintRepository.create({
      ...input,
      userId,
      status: ComplaintStatus.OPEN,
    });
    return this.complaintRepository.save(complaint);
  }

  async respond(
    id: string,
    status: ComplaintStatus,
    adminResponse?: string,
  ): Promise<Complaint> {
    const complaint = await this.findById(id);
    if (!complaint) throw new NotFoundException('Khiếu nại không tồn tại');
    complaint.status = status;
    if (adminResponse !== undefined) complaint.adminResponse = adminResponse;
    return this.complaintRepository.save(complaint);
  }
}
