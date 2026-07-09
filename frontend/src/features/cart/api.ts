import { gqlRequest } from '@/lib/graphql-client';
import {
  fromGraphQLProductType,
  toGraphQLProductType,
  type ProductTypeKey,
} from '../products/product-types';

export interface CartItemDetail {
  id: string;
  productType: ProductTypeKey;
  productId: string;
  quantity: number;
  productName: string;
  imageUrl: string;
  unitPrice: number;
  stock: number;
  subtotal: number;
}

export interface CartDetail {
  id: string;
  items: CartItemDetail[];
  totalPrice: number;
  updatedAt: string;
}

const CART_FIELDS = `
  id
  totalPrice
  updatedAt
  items {
    id
    productType
    productId
    quantity
    productName
    imageUrl
    unitPrice
    stock
    subtotal
  }
`;

// Backend trả về tên key enum ('CPU') chứ không phải giá trị chuỗi ('cpu') mà
// frontend dùng nội bộ — dịch lại ngay khi nhận, trước khi cache/hiển thị.
function normalizeCart(raw: CartDetail): CartDetail {
  return {
    ...raw,
    items: raw.items.map((item) => ({
      ...item,
      productType: fromGraphQLProductType(item.productType),
    })),
  };
}

export async function fetchMyCart() {
  const query = `
    query MyCart {
      myCart {
        ${CART_FIELDS}
      }
    }
  `;
  const data = await gqlRequest<{ myCart: CartDetail }>(query);
  return normalizeCart(data.myCart);
}

export async function addToCartRequest(input: {
  productType: ProductTypeKey;
  productId: string;
  quantity: number;
}) {
  const query = `
    mutation AddToCart($input: AddCartItemInput!) {
      addToCart(input: $input) {
        ${CART_FIELDS}
      }
    }
  `;
  const data = await gqlRequest<{ addToCart: CartDetail }>(query, {
    input: { ...input, productType: toGraphQLProductType(input.productType) },
  });
  return normalizeCart(data.addToCart);
}

export async function updateCartItemQuantityRequest(itemId: string, quantity: number) {
  const query = `
    mutation UpdateCartItemQuantity($input: UpdateCartItemInput!) {
      updateCartItemQuantity(input: $input) {
        ${CART_FIELDS}
      }
    }
  `;
  const data = await gqlRequest<{ updateCartItemQuantity: CartDetail }>(query, {
    input: { itemId, quantity },
  });
  return normalizeCart(data.updateCartItemQuantity);
}

export async function removeCartItemRequest(itemId: string) {
  const query = `
    mutation RemoveCartItem($itemId: String!) {
      removeCartItem(itemId: $itemId) {
        ${CART_FIELDS}
      }
    }
  `;
  const data = await gqlRequest<{ removeCartItem: CartDetail }>(query, { itemId });
  return normalizeCart(data.removeCartItem);
}

export async function clearCartRequest() {
  const query = `
    mutation ClearCart {
      clearCart {
        ${CART_FIELDS}
      }
    }
  `;
  const data = await gqlRequest<{ clearCart: CartDetail }>(query);
  return normalizeCart(data.clearCart);
}

export interface CheckoutInput {
  shippingAddress: string;
  phoneNumber: string;
  note?: string;
}

export async function checkoutCartRequest(input: CheckoutInput) {
  const query = `
    mutation CheckoutCart($input: CheckoutCartInput!) {
      checkoutCart(input: $input) {
        id
        status
        totalPrice
      }
    }
  `;
  const data = await gqlRequest<{
    checkoutCart: { id: string; status: string; totalPrice: number };
  }>(query, { input });
  return data.checkoutCart;
}
