// Shopify Storefront API Client

function getShopifyConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-07';
  
  if (!domain || !storefrontAccessToken) {
    throw new Error(
      'Missing required Shopify environment variables. Please check SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local'
    );
  }
  
  return {
    domain,
    storefrontAccessToken,
    apiVersion,
    endpoint: `https://${domain}/api/${apiVersion}/graphql.json`,
  };
}

interface ShopifyResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

export async function shopifyFetch<T>({
  query,
  variables = {},
  cache = 'force-cache',
  tags = [],
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  tags?: string[];
}): Promise<T> {
  const config = getShopifyConfig();

  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': config.storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache,
      ...(tags.length > 0 && { next: { tags } }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
    }

    const json: ShopifyResponse<T> = await response.json();

    if (json.errors) {
      console.error('Shopify GraphQL errors:', json.errors);
      throw new Error(json.errors[0]?.message || 'GraphQL query failed');
    }

    if (!json.data) {
      throw new Error('No data returned from Shopify');
    }

    return json.data;
  } catch (error) {
    console.error('Shopify fetch error:', error);
    throw error;
  }
}

export function formatPrice(amount: string, currencyCode: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}

export function getShopifyImageUrl(url: string, options?: { width?: number; height?: number }): string {
  if (!options) return url;
  
  const params = new URLSearchParams();
  if (options.width) params.append('width', options.width.toString());
  if (options.height) params.append('height', options.height.toString());
  
  const queryString = params.toString();
  return queryString ? `${url}${url.includes('?') ? '&' : '?'}${queryString}` : url;
}

// Export for debugging
export function checkShopifyConfig() {
  try {
    const config = getShopifyConfig();
    return { success: true, domain: config.domain };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

