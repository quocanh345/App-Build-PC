export type CpuFilter = {
  name?: string;
  socket?: string;
  minCore?: number;
  maxCore?: number;
  minFrequency?: number;
  maxFrequency?: number;
  minCache?: number;
  maxCache?: number;
  iGPU?: boolean;
  minPrice?: number;
  maxPrice?: number;
};

export type RamFilter = {
  name?: string;
  standard?: string;
  latency?: string;
  minBus?: number;
  maxBus?: number;
  minMemory?: number;
  maxMemory?: number;
  minPrice?: number;
  maxPrice?: number;
};

export type VgaFilter = {
  name?: string;
  architecture?: string;
  minVMemory?: number;
  maxVMemory?: number;
  minTgp?: number;
  maxTgp?: number;
  minPrice?: number;
  maxPrice?: number;
};

export type MainboardFilter = {
  name?: string;
  socket?: string;
  chipset?: string;
  formFactor?: string;
  memoryType?: string;
  minPrice?: number;
  maxPrice?: number;
};

export type PsuFilter = {
  name?: string;
  efficiency?: string;
  modular?: string;
  minWattage?: number;
  maxWattage?: number;
  minPrice?: number;
  maxPrice?: number;
};

export type CoolerFilter = {
  name?: string;
  type?: string;
  socketSupport?: string;
  minSize?: number;
  maxSize?: number;
  minPrice?: number;
  maxPrice?: number;
};

export type CaseFilter = {
  name?: string;
  formFactor?: string;
  minMaxGpuLength?: number;
  minMaxCoolerHeight?: number;
  minPrice?: number;
  maxPrice?: number;
};

export type SsdFilter = {
  name?: string;
  type?: string;
  minCapacity?: number;
  maxCapacity?: number;
  minReadSpeed?: number;
  minWriteSpeed?: number;
  minPrice?: number;
  maxPrice?: number;
};
