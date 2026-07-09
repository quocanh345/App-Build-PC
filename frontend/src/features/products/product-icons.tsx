import {
  Cpu,
  MemoryStick,
  Gpu,
  CircuitBoard,
  Zap,
  Fan,
  PcCase,
  HardDrive,
  type LucideIcon,
} from 'lucide-react';
import type { ProductTypeKey } from './product-types';

export const PRODUCT_TYPE_ICONS: Record<ProductTypeKey, LucideIcon> = {
  cpu: Cpu,
  ram: MemoryStick,
  vga: Gpu,
  mainboard: CircuitBoard,
  psu: Zap,
  cooler: Fan,
  case: PcCase,
  ssd: HardDrive,
};
