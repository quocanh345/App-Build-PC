import { registerEnumType } from '@nestjs/graphql';

export enum ProductType {
  CPU = 'cpu',
  RAM = 'ram',
  VGA = 'vga',
  MAINBOARD = 'mainboard',
  PSU = 'psu',
  COOLER = 'cooler',
  CASE = 'case',
  SSD = 'ssd',
}

registerEnumType(ProductType, { name: 'ProductType' });
