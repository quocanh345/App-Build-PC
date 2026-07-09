import { EntityTarget, ObjectLiteral } from 'typeorm';
import { ProductType } from './product-type.enum';
import { Cpu } from './entities/cpu.entity';
import { Ram } from './entities/ram.entity';
import { Vga } from './entities/vga.entity';
import { Mainboard } from './entities/mainboard.entity';
import { Psu } from './entities/psu.entity';
import { Cooler } from './entities/cooler.entity';
import { Case } from './entities/case.entity';
import { Ssd } from './entities/ssd.entity';

export const PRODUCT_ENTITIES: Record<
  ProductType,
  EntityTarget<ObjectLiteral>
> = {
  [ProductType.CPU]: Cpu,
  [ProductType.RAM]: Ram,
  [ProductType.VGA]: Vga,
  [ProductType.MAINBOARD]: Mainboard,
  [ProductType.PSU]: Psu,
  [ProductType.COOLER]: Cooler,
  [ProductType.CASE]: Case,
  [ProductType.SSD]: Ssd,
};
