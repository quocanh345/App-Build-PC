import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { Complaint } from './entities/complaint.entity';
import { CreateComplaintInput } from './dto/create-complaint.input';
import { RespondComplaintInput } from './dto/respond-complaint.input';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { tokenPayload } from '../auth/auth.type';

@UseGuards(AuthGuard)
@Resolver(() => Complaint)
export class ComplaintResolver {
  constructor(private readonly complaintService: ComplaintService) {}

  @Query(() => [Complaint])
  async myComplaints(@CurrentUser() user: tokenPayload) {
    return this.complaintService.findMine(user.id);
  }

  @Query(() => [Complaint])
  async orderComplaints(
    @CurrentUser() user: tokenPayload,
    @Args('orderId') orderId: string,
  ) {
    return this.complaintService.findByOrder(orderId, user);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Query(() => [Complaint])
  async allComplaints() {
    return this.complaintService.findAll();
  }

  @Mutation(() => Complaint)
  async createComplaint(
    @CurrentUser() user: tokenPayload,
    @Args('input') input: CreateComplaintInput,
  ) {
    return this.complaintService.create(user, input);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Mutation(() => Complaint)
  async respondComplaint(@Args('input') input: RespondComplaintInput) {
    return this.complaintService.respond(
      input.id,
      input.status,
      input.adminResponse,
    );
  }
}
