export type ProductTypeKey =
  | 'cpu'
  | 'ram'
  | 'vga'
  | 'mainboard'
  | 'psu'
  | 'cooler'
  | 'case'
  | 'ssd';

export const COMMON_PRODUCT_FIELDS = [
  'id',
  'name',
  'manufacturer',
  'description',
  'imageUrl',
  'stock',
  'isActive',
  'price',
  'createdAt',
  'updatedAt',
] as const;

export interface ProductFieldDef {
  name: string;
  label: string;
  kind: 'text' | 'int' | 'float';
}

// Field chung cho form tạo/sửa sản phẩm (isActive không có trong Create/UpdateInput ở backend nên không đưa vào form).
export const COMMON_FORM_FIELDS: ProductFieldDef[] = [
  { name: 'name', label: 'Tên sản phẩm', kind: 'text' },
  { name: 'manufacturer', label: 'Hãng sản xuất', kind: 'text' },
  { name: 'description', label: 'Mô tả', kind: 'text' },
  { name: 'imageUrl', label: 'Link ảnh', kind: 'text' },
  { name: 'stock', label: 'Tồn kho', kind: 'int' },
  { name: 'price', label: 'Giá (VNĐ)', kind: 'int' },
];

export interface ProductTypeConfig {
  key: ProductTypeKey;
  label: string;
  // Trùng với tên type trong GraphQL schema (Cpu, Ram, Vga, ...) — dùng để suy ra
  // tên field/mutation (getAllCpu, getCpuById, filterCpu, createCpu, CpuInput, ...).
  gqlType: string;
  // Các field đặc thù của loại này (ngoài field chung ở trên), dùng cho cả query lẫn form.
  formFields: ProductFieldDef[];
}

export const PRODUCT_TYPES: ProductTypeConfig[] = [
  {
    key: 'cpu',
    label: 'CPU',
    gqlType: 'Cpu',
    formFields: [
      { name: 'cores', label: 'Số nhân', kind: 'int' },
      { name: 'threads', label: 'Số luồng', kind: 'int' },
      { name: 'frequency', label: 'Xung nhịp (GHz)', kind: 'float' },
      { name: 'cache', label: 'Bộ nhớ đệm (MB)', kind: 'int' },
      { name: 'socket', label: 'Socket', kind: 'text' },
      { name: 'tdp', label: 'TDP (W)', kind: 'int' },
      { name: 'iGPU', label: 'Card đồ hoạ tích hợp', kind: 'text' },
    ],
  },
  {
    key: 'ram',
    label: 'RAM',
    gqlType: 'Ram',
    formFields: [
      { name: 'memory', label: 'Dung lượng (GB)', kind: 'int' },
      { name: 'bus', label: 'Bus (MHz)', kind: 'int' },
      { name: 'standard', label: 'Chuẩn (DDR4/DDR5)', kind: 'text' },
      { name: 'latency', label: 'Độ trễ (CAS Latency)', kind: 'text' },
    ],
  },
  {
    key: 'vga',
    label: 'VGA',
    gqlType: 'Vga',
    formFields: [
      { name: 'architecture', label: 'Kiến trúc', kind: 'text' },
      { name: 'vMemory', label: 'VRAM (GB)', kind: 'int' },
      { name: 'frequency', label: 'Xung nhịp (MHz)', kind: 'int' },
      { name: 'cores', label: 'Số nhân CUDA/Stream', kind: 'int' },
      { name: 'tgp', label: 'TGP (W)', kind: 'int' },
      { name: 'port', label: 'Cổng kết nối', kind: 'text' },
    ],
  },
  {
    key: 'mainboard',
    label: 'Mainboard',
    gqlType: 'Mainboard',
    formFields: [
      { name: 'socket', label: 'Socket', kind: 'text' },
      { name: 'chipset', label: 'Chipset', kind: 'text' },
      { name: 'formFactor', label: 'Form factor', kind: 'text' },
      { name: 'memorySlots', label: 'Số khe RAM', kind: 'int' },
      { name: 'memoryType', label: 'Loại RAM hỗ trợ', kind: 'text' },
      { name: 'maxMemory', label: 'Dung lượng RAM tối đa (GB)', kind: 'int' },
    ],
  },
  {
    key: 'psu',
    label: 'Nguồn (PSU)',
    gqlType: 'Psu',
    formFields: [
      { name: 'wattage', label: 'Công suất (W)', kind: 'int' },
      { name: 'efficiency', label: 'Chuẩn hiệu suất (80 Plus)', kind: 'text' },
      { name: 'modular', label: 'Loại dây (Full/Semi/Non-modular)', kind: 'text' },
    ],
  },
  {
    key: 'cooler',
    label: 'Tản nhiệt',
    gqlType: 'Cooler',
    formFields: [
      { name: 'type', label: 'Loại (khí/nước)', kind: 'text' },
      { name: 'size', label: 'Kích thước (mm)', kind: 'int' },
      { name: 'fanSpeed', label: 'Tốc độ quạt (RPM)', kind: 'int' },
      { name: 'noise', label: 'Độ ồn (dBA)', kind: 'float' },
      { name: 'socketSupport', label: 'Socket hỗ trợ', kind: 'text' },
    ],
  },
  {
    key: 'case',
    label: 'Vỏ case',
    gqlType: 'Case',
    formFields: [
      { name: 'formFactor', label: 'Form factor', kind: 'text' },
      { name: 'maxGpuLength', label: 'Độ dài VGA tối đa (mm)', kind: 'int' },
      { name: 'maxCoolerHeight', label: 'Chiều cao tản tối đa (mm)', kind: 'int' },
      { name: 'includedFans', label: 'Số quạt đi kèm', kind: 'int' },
    ],
  },
  {
    key: 'ssd',
    label: 'Ổ cứng (SSD)',
    gqlType: 'Ssd',
    formFields: [
      { name: 'capacity', label: 'Dung lượng (GB)', kind: 'int' },
      { name: 'type', label: 'Chuẩn kết nối (SATA/NVMe)', kind: 'text' },
      { name: 'readSpeed', label: 'Tốc độ đọc (MB/s)', kind: 'int' },
      { name: 'writeSpeed', label: 'Tốc độ ghi (MB/s)', kind: 'int' },
    ],
  },
];

export function findProductTypeConfig(key: string): ProductTypeConfig | undefined {
  return PRODUCT_TYPES.find((type) => type.key === key);
}

export function getProductTypeConfig(key: string): ProductTypeConfig {
  const config = findProductTypeConfig(key);
  if (!config) throw new Error(`Loại sản phẩm không hợp lệ: ${key}`);
  return config;
}

// Backend đăng ký enum GraphQL "ProductType" bằng registerEnumType(), nên giá trị
// truyền qua wire là TÊN KEY TypeScript (CPU, RAM, ...), không phải giá trị chuỗi
// bên trong ('cpu', 'ram', ...) mà frontend dùng cho routing/URL. Phải dịch trước khi gửi.
export function toGraphQLProductType(key: ProductTypeKey): string {
  return key.toUpperCase();
}

// Chiều ngược lại: backend trả về tên key ('CPU') trong mọi query/mutation — dịch
// về chữ thường để khớp với ProductTypeKey dùng nội bộ (routing, config, so khớp).
export function fromGraphQLProductType(value: string): ProductTypeKey {
  return value.toLowerCase() as ProductTypeKey;
}
