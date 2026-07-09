import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductLookupService } from './product-lookup.service';
import { ProductResolver } from './product.resolver';
import { Cpu } from './entities/cpu.entity';
import { Ram } from './entities/ram.entity';
import { Vga } from './entities/vga.entity';
import { Mainboard } from './entities/mainboard.entity';
import { Psu } from './entities/psu.entity';
import { Cooler } from './entities/cooler.entity';
import { Case } from './entities/case.entity';
import { Ssd } from './entities/ssd.entity';
import { CpuRepository } from './repositories/cpu.repository';
import { RamRepository } from './repositories/ram.repository';
import { VgaRepository } from './repositories/vga.repository';
import { MainboardRepository } from './repositories/mainboard.repository';
import { PsuRepository } from './repositories/psu.repository';
import { CoolerRepository } from './repositories/cooler.repository';
import { CaseRepository } from './repositories/case.repository';
import { SsdRepository } from './repositories/ssd.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cpu,
      Ram,
      Vga,
      Mainboard,
      Psu,
      Cooler,
      Case,
      Ssd,
    ]),
    AuthModule,
  ],
  providers: [
    ProductResolver,
    ProductService,
    ProductLookupService,
    CpuRepository,
    RamRepository,
    VgaRepository,
    MainboardRepository,
    PsuRepository,
    CoolerRepository,
    CaseRepository,
    SsdRepository,
  ],
  exports: [ProductService, ProductLookupService],
})
export class ProductModule {}
