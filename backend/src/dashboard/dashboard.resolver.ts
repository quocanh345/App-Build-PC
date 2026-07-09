import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardStats } from './dashboard.type';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Resolver()
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Query(() => DashboardStats)
  async adminDashboardStats() {
    return this.dashboardService.getStats();
  }
}
