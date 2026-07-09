import { Injectable } from '@nestjs/common';
import { ComplaintRepository } from './complaint.repository';
import { OrderService } from '../order/order.service';
import { Complaint } from './entities/complaint.entity';
import { ComplaintStatus } from './complaint-status.enum';
import { CreateComplaintInput } from './dto/create-complaint.input';
import type { tokenPayload } from '../auth/auth.type';

@Injectable()
export class ComplaintService {
  constructor(
    private readonly complaintRepository: ComplaintRepository,
    private readonly orderService: OrderService,
  ) {}

  async create(
    user: tokenPayload,
    input: CreateComplaintInput,
  ): Promise<Complaint> {
    // Tái dùng OrderService.findOne: vừa xác nhận đơn tồn tại, vừa đảm bảo đơn
    // này thuộc về đúng người gửi khiếu nại (ném lỗi nếu không phải chủ đơn).
    await this.orderService.findOne(input.orderId, user);
    return this.complaintRepository.create(user.id, input);
  }

  async findMine(userId: string): Promise<Complaint[]> {
    return this.complaintRepository.findByUser(userId);
  }

  async findByOrder(
    orderId: string,
    requester: tokenPayload,
  ): Promise<Complaint[]> {
    await this.orderService.findOne(orderId, requester);
    return this.complaintRepository.findByOrder(orderId);
  }

  async findAll(): Promise<Complaint[]> {
    return this.complaintRepository.findAll();
  }

  async respond(
    id: string,
    status: ComplaintStatus,
    adminResponse?: string,
  ): Promise<Complaint> {
    return this.complaintRepository.respond(id, status, adminResponse);
  }
}
