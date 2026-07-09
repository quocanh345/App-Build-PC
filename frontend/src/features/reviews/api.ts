import { gqlRequest } from '@/lib/graphql-client';
import { toGraphQLProductType, type ProductTypeKey } from '../products/product-types';

export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface RatingSummary {
  average: number;
  count: number;
}

export async function fetchProductReviews(typeKey: ProductTypeKey, productId: string) {
  const query = `
    query ProductReviews($productType: ProductType!, $productId: String!) {
      productReviews(productType: $productType, productId: $productId) {
        id
        userId
        rating
        comment
        createdAt
      }
    }
  `;
  const data = await gqlRequest<{ productReviews: Review[] }>(query, {
    productType: toGraphQLProductType(typeKey),
    productId,
  });
  return data.productReviews;
}

export async function fetchRatingSummary(typeKey: ProductTypeKey, productId: string) {
  const query = `
    query ProductRatingSummary($productType: ProductType!, $productId: String!) {
      productRatingSummary(productType: $productType, productId: $productId) {
        average
        count
      }
    }
  `;
  const data = await gqlRequest<{ productRatingSummary: RatingSummary }>(query, {
    productType: toGraphQLProductType(typeKey),
    productId,
  });
  return data.productRatingSummary;
}

export async function fetchMyReview(typeKey: ProductTypeKey, productId: string) {
  const query = `
    query MyReview($productType: ProductType!, $productId: String!) {
      myReview(productType: $productType, productId: $productId) {
        id
        rating
        comment
      }
    }
  `;
  const data = await gqlRequest<{ myReview: Review | null }>(query, {
    productType: toGraphQLProductType(typeKey),
    productId,
  });
  return data.myReview;
}

export async function upsertReviewRequest(input: {
  productType: ProductTypeKey;
  productId: string;
  rating: number;
  comment?: string;
}) {
  const query = `
    mutation UpsertReview($input: UpsertReviewInput!) {
      upsertReview(input: $input) {
        id
        rating
        comment
      }
    }
  `;
  const data = await gqlRequest<{ upsertReview: Review }>(query, {
    input: { ...input, productType: toGraphQLProductType(input.productType) },
  });
  return data.upsertReview;
}

export async function deleteReviewRequest(id: string) {
  const query = `
    mutation DeleteReview($id: String!) {
      deleteReview(id: $id)
    }
  `;
  const data = await gqlRequest<{ deleteReview: boolean }>(query, { id });
  return data.deleteReview;
}
