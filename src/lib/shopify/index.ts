// Shopify API Functions

import { shopifyFetch } from './client';
import {
  getProductByHandleQuery,
  getProductsQuery,
  getCollectionByHandleQuery,
  getCollectionsQuery,
} from './queries';
import type {
  ShopifyProduct,
  ShopifyCollection,
} from './types';

export * from './types';
export * from './client';

interface ProductResponse {
  product: ShopifyProduct | null;
}

interface ProductsResponse {
  products: {
    edges: Array<{ node: ShopifyProduct; cursor: string }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

interface CollectionResponse {
  collection: ShopifyCollection | null;
}

interface CollectionsResponse {
  collections: {
    edges: Array<{ node: ShopifyCollection }>;
  };
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<ProductResponse>({
    query: getProductByHandleQuery,
    variables: { handle },
    tags: [`product-${handle}`],
  });

  return data.product;
}

export async function getProducts(first: number = 20, after?: string): Promise<{
  products: ShopifyProduct[];
  hasNextPage: boolean;
}> {
  const data = await shopifyFetch<ProductsResponse>({
    query: getProductsQuery,
    variables: { first, after },
    tags: ['products'],
  });

  return {
    products: data.products.edges.map((edge) => edge.node),
    hasNextPage: data.products.pageInfo.hasNextPage,
  };
}

export async function getCollection(handle: string): Promise<ShopifyCollection | null> {
  const data = await shopifyFetch<CollectionResponse>({
    query: getCollectionByHandleQuery,
    variables: { handle, first: 50 },
    tags: [`collection-${handle}`],
  });

  return data.collection;
}

export async function getCollections(first: number = 20): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<CollectionsResponse>({
    query: getCollectionsQuery,
    variables: { first },
    tags: ['collections'],
  });

  return data.collections.edges.map((edge) => edge.node);
}

