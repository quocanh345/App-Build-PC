import { gqlRequest } from '@/lib/graphql-client';
import { COMMON_PRODUCT_FIELDS, getProductTypeConfig } from './product-types';

export interface Product {
  id: string;
  name: string;
  manufacturer: string;
  description: string;
  imageUrl: string;
  stock: number;
  isActive: boolean;
  price: number;
  createdAt: string;
  updatedAt: string;
  // các field đặc thù theo từng loại (cores, wattage, capacity, ...)
  [extraField: string]: unknown;
}

function buildSelectionSet(extraFields: string[]): string {
  return [...COMMON_PRODUCT_FIELDS, ...extraFields].join('\n      ');
}

export async function fetchAllProducts(typeKey: string): Promise<Product[]> {
  const config = getProductTypeConfig(typeKey);
  const operation = `getAll${config.gqlType}`;
  const query = `
    query GetAll${config.gqlType} {
      ${operation} {
        ${buildSelectionSet(config.formFields.map((field) => field.name))}
      }
    }
  `;
  const data = await gqlRequest<Record<string, Product[]>>(query);
  return data[operation];
}

export async function fetchProductById(
  typeKey: string,
  id: string,
): Promise<Product> {
  const config = getProductTypeConfig(typeKey);
  const operation = `get${config.gqlType}ById`;
  const query = `
    query Get${config.gqlType}ById($id: String!) {
      ${operation}(id: $id) {
        ${buildSelectionSet(config.formFields.map((field) => field.name))}
      }
    }
  `;
  const data = await gqlRequest<Record<string, Product>>(query, { id });
  return data[operation];
}
