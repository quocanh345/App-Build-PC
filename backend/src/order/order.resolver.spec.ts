import { Test, TestingModule } from '@nestjs/testing';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { TokenService } from '../auth/token.service';

describe('OrderResolver', () => {
  let resolver: OrderResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderResolver,
        OrderService,
        AuthGuard,
        RolesGuard,
        { provide: OrderRepository, useValue: {} },
        { provide: TokenService, useValue: {} },
      ],
    }).compile();

    resolver = module.get<OrderResolver>(OrderResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
