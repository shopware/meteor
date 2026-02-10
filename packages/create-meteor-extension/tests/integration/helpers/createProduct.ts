/**
 * Helper to create test products via Shopware API
 */
import { randomBytes } from 'crypto';

interface Product {
  id: string;
  name: string;
}

/**
 * Generate a UUID v4 using Node.js crypto module
 */
function generateUUID(): string {
  const bytes = randomBytes(16);
  
  // Set version (4) and variant bits according to RFC 4122
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10
  
  // Convert to hex string with dashes
  const hex = bytes.toString('hex');
  return [
    hex.substring(0, 8),
    hex.substring(8, 12),
    hex.substring(12, 16),
    hex.substring(16, 20),
    hex.substring(20, 32),
  ].join('-');
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
  const productId = generateUUID();
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
