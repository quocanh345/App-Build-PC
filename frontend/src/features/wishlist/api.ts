import { gqlRequest } from '@/lib/graphql-client';
import {
  fromGraphQLProductType,
  toGraphQLProductType,
  type ProductTypeKey,
} from '../products/product-types';

export interface WishlistItem {
  id: string;
  productType: ProductTypeKey;
  productId: string;
  productName: string;
  imageUrl: string;
  price: number;
  stock: number;
}

function normalizeItem(raw: WishlistItem): WishlistItem {
  return { ...raw, productType: fromGraphQLProductType(raw.productType) };
}

export async function fetchMyWishlist() {
  const query = `
    query MyWishlist {
      myWishlist {
        id
        productType
        productId
        productName
        imageUrl
        price
        stock
      }
    }
  `;
  const data = await gqlRequest<{ myWishlist: WishlistItem[] }>(query);
  return data.myWishlist.map(normalizeItem);
}

export async function toggleWishlistRequest(
  typeKey: ProductTypeKey,
  productId: string,
) {
  const query = `
    mutation ToggleWishlist($input: ToggleWishlistInput!) {
      toggleWishlist(input: $input)
    }
  `;
  const data = await gqlRequest<{ toggleWishlist: boolean }>(query, {
    input: { productType: toGraphQLProductType(typeKey), productId },
  });
  return data.toggleWishlist;
}
