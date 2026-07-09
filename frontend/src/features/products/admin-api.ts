import { gqlRequest } from '@/lib/graphql-client';
import { getProductTypeConfig } from './product-types';
import type { Product } from './api';

const MUTATION_FIELDS = 'id';

export async function createProductRequest(
  typeKey: string,
  input: Record<string, unknown>,
): Promise<Product> {
  const config = getProductTypeConfig(typeKey);
  const operation = `create${config.gqlType}`;
  const query = `
    mutation Create${config.gqlType}($input: Create${config.gqlType}Input!) {
      ${operation}(input: $input) {
        ${MUTATION_FIELDS}
      }
    }
  `;
  const data = await gqlRequest<Record<string, Product>>(query, { input });
  return data[operation];
}

export async function updateProductRequest(
  typeKey: string,
  id: string,
  input: Record<string, unknown>,
): Promise<Product> {
  const config = getProductTypeConfig(typeKey);
  const operation = `update${config.gqlType}`;
  const query = `
    mutation Update${config.gqlType}($id: String!, $input: Update${config.gqlType}Input!) {
      ${operation}(id: $id, input: $input) {
        ${MUTATION_FIELDS}
      }
    }
  `;
  const data = await gqlRequest<Record<string, Product>>(query, { id, input });
  return data[operation];
}

export async function removeProductRequest(
  typeKey: string,
  id: string,
): Promise<void> {
  const config = getProductTypeConfig(typeKey);
  const operation = `remove${config.gqlType}`;
  const query = `
    mutation Remove${config.gqlType}($id: String!) {
      ${operation}(id: $id) {
        ${MUTATION_FIELDS}
      }
    }
  `;
  await gqlRequest(query, { id });
}
