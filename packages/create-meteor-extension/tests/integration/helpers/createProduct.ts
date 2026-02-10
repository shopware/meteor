/**
 * Helper to create test products via Shopware API
 */

interface Product {
  id: string;
  name: string;
}

/**
 * Get OAuth token for Shopware API
 */
async function getAuthToken(): Promise<string> {
  const appUrl = process.env.APP_URL || 'http://localhost:8000';
  const username = process.env.SHOPWARE_ADMIN_USERNAME || 'admin';
  const password = process.env.SHOPWARE_ADMIN_PASSWORD || 'shopware';

  const response = await fetch(`${appUrl}api/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: 'administration',
      grant_type: 'password',
      username,
      password,
      scope: 'write',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to authenticate: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Create a basic test product
 */
export async function createBasicProduct(): Promise<Product> {
  const appUrl = process.env.APP_URL || 'http://localhost:8000';
  const token = await getAuthToken();

  // Generate random product name to avoid conflicts
  const randomId = Math.random().toString(36).substring(7);
  const productName = `Test Product ${randomId}`;

  // Get a tax ID (we'll use the first one available)
  const taxResponse = await fetch(`${appUrl}api/search/tax`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      limit: 1,
    }),
  });

  if (!taxResponse.ok) {
    throw new Error('Failed to fetch tax data');
  }

  const taxData = await taxResponse.json();
  const taxId = taxData.data[0]?.id;

  if (!taxId) {
    throw new Error('No tax configuration found');
  }

  // Create the product
  const productId = crypto.randomUUID();
  const productResponse = await fetch(`${appUrl}api/product`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: productId,
      name: productName,
      productNumber: `TEST-${randomId}`,
      stock: 10,
      taxId: taxId,
      price: [
        {
          currencyId: 'b7d2554b0ce847cd82f3ac9bd1c0dfca', // EUR default
          gross: 19.99,
          net: 16.8,
          linked: true,
        },
      ],
    }),
  });

  if (!productResponse.ok) {
    const errorText = await productResponse.text();
    throw new Error(`Failed to create product: ${errorText}`);
  }

  return {
    id: productId,
    name: productName,
  };
}
