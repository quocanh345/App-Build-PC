import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplaintService } from './complaint.service';
import { ComplaintResolver } from './complaint.resolver';
import { ComplaintRepository } from './complaint.repository';
import { Complaint } from './entities/complaint.entity';
import { AuthModule } from '../auth/auth.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [TypeOrmModule.forFeature([Complaint]), AuthModule, OrderModule],
  providers: [ComplaintResolver, ComplaintService, ComplaintRepository],
})
export class ComplaintModule {}
