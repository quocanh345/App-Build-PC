import type { ProductTypeKey } from './product-types';

export type FilterFieldKind = 'discrete' | 'range';
export type FilterFieldCategory = 'basic' | 'advanced';

export interface FilterFieldDef {
  name: string;
  label: string;
  kind: FilterFieldKind;
  category: FilterFieldCategory;
  unit?: string;
}

// Áp dụng cho mọi loại sản phẩm — giá và hãng sản xuất là thứ ai cũng quan tâm/biết.
const COMMON_FILTER_FIELDS: FilterFieldDef[] = [
  { name: 'manufacturer', label: 'Hãng sản xuất', kind: 'discrete', category: 'basic' },
  { name: 'price', label: 'Giá', kind: 'range', category: 'basic', unit: 'đ' },
];

// Cơ bản: người dùng phổ thông biết/quan tâm (giá, số nhân, dung lượng, socket...).
// Nâng cao: thông số kỹ thuật sâu hơn (cache, kiến trúc, độ trễ...).
const FILTER_FIELDS_BY_TYPE: Record<ProductTypeKey, FilterFieldDef[]> = {
  cpu: [
    { name: 'socket', label: 'Socket', kind: 'discrete', category: 'basic' },
    { name: 'cores', label: 'Số nhân', kind: 'discrete', category: 'basic', unit: 'nhân' },
    { name: 'threads', label: 'Số luồng', kind: 'discrete', category: 'advanced', unit: 'luồng' },
    { name: 'frequency', label: 'Xung nhịp', kind: 'range', category: 'advanced', unit: 'GHz' },
    { name: 'cache', label: 'Bộ nhớ đệm', kind: 'range', category: 'advanced', unit: 'MB' },
    { name: 'tdp', label: 'TDP', kind: 'range', category: 'advanced', unit: 'W' },
    { name: 'iGPU', label: 'Card đồ hoạ tích hợp', kind: 'discrete', category: 'advanced' },
  ],
  ram: [
    { name: 'standard', label: 'Chuẩn', kind: 'discrete', category: 'basic' },
    { name: 'memory', label: 'Dung lượng', kind: 'discrete', category: 'basic', unit: 'GB' },
    { name: 'bus', label: 'Bus', kind: 'discrete', category: 'advanced', unit: 'MHz' },
    { name: 'latency', label: 'Độ trễ (CL)', kind: 'discrete', category: 'advanced' },
  ],
  vga: [
    { name: 'vMemory', label: 'VRAM', kind: 'discrete', category: 'basic', unit: 'GB' },
    { name: 'tgp', label: 'Công suất (TGP)', kind: 'range', category: 'basic', unit: 'W' },
    { name: 'architecture', label: 'Kiến trúc', kind: 'discrete', category: 'advanced' },
    { name: 'frequency', label: 'Xung nhịp', kind: 'range', category: 'advanced', unit: 'MHz' },
    { name: 'cores', label: 'Số nhân CUDA/Stream', kind: 'range', category: 'advanced', unit: 'nhân' },
    { name: 'port', label: 'Cổng kết nối', kind: 'discrete', category: 'advanced' },
  ],
  mainboard: [
    { name: 'socket', label: 'Socket', kind: 'discrete', category: 'basic' },
    { name: 'formFactor', label: 'Form factor', kind: 'discrete', category: 'basic' },
    { name: 'chipset', label: 'Chipset', kind: 'discrete', category: 'basic' },
    { name: 'memoryType', label: 'Loại RAM hỗ trợ', kind: 'discrete', category: 'basic' },
    { name: 'memorySlots', label: 'Số khe RAM', kind: 'discrete', category: 'advanced', unit: 'khe' },
    { name: 'maxMemory', label: 'RAM tối đa', kind: 'discrete', category: 'advanced', unit: 'GB' },
  ],
  psu: [
    { name: 'wattage', label: 'Công suất', kind: 'discrete', category: 'basic', unit: 'W' },
    { name: 'efficiency', label: 'Chuẩn hiệu suất', kind: 'discrete', category: 'basic' },
    { name: 'modular', label: 'Loại dây', kind: 'discrete', category: 'advanced' },
  ],
  cooler: [
    { name: 'type', label: 'Loại tản', kind: 'discrete', category: 'basic' },
    { name: 'size', label: 'Kích thước', kind: 'discrete', category: 'basic', unit: 'mm' },
    { name: 'fanSpeed', label: 'Tốc độ quạt', kind: 'range', category: 'advanced', unit: 'RPM' },
    { name: 'noise', label: 'Độ ồn', kind: 'range', category: 'advanced', unit: 'dBA' },
    { name: 'socketSupport', label: 'Socket hỗ trợ', kind: 'discrete', category: 'advanced' },
  ],
  case: [
    { name: 'formFactor', label: 'Form factor', kind: 'discrete', category: 'basic' },
    { name: 'includedFans', label: 'Số quạt đi kèm', kind: 'discrete', category: 'basic', unit: 'quạt' },
    { name: 'maxGpuLength', label: 'Độ dài VGA tối đa', kind: 'range', category: 'advanced', unit: 'mm' },
    { name: 'maxCoolerHeight', label: 'Chiều cao tản tối đa', kind: 'range', category: 'advanced', unit: 'mm' },
  ],
  ssd: [
    { name: 'type', label: 'Chuẩn kết nối', kind: 'discrete', category: 'basic' },
    { name: 'capacity', label: 'Dung lượng', kind: 'discrete', category: 'basic', unit: 'GB' },
    { name: 'readSpeed', label: 'Tốc độ đọc', kind: 'range', category: 'advanced', unit: 'MB/s' },
    { name: 'writeSpeed', label: 'Tốc độ ghi', kind: 'range', category: 'advanced', unit: 'MB/s' },
  ],
};

export function getFilterFields(typeKey: ProductTypeKey): FilterFieldDef[] {
  return [...COMMON_FILTER_FIELDS, ...FILTER_FIELDS_BY_TYPE[typeKey]];
}
