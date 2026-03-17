/**
 * Helper to get or create test products via Shopware API
 */
import { randomUUID } from 'crypto'

interface Product {
  id: string
  name: string
}

/**
 * Try to find an existing product first, fallback to creation
 */
async function findExistingProduct(
  token: string,
  appUrl: string,
): Promise<Product | null> {
  try {
    const searchResponse = await fetch(`${appUrl}api/search/product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        limit: 1,
        filter: [
          {
            type: 'equals',
            field: 'active',
            value: true,
          },
        ],
      }),
    })

    if (searchResponse.ok) {
      const data = await searchResponse.json()
      if (data.data && data.data.length > 0) {
        const product = data.data[0]
        console.log('Found existing product:', product.id, product.name)
        return {
          id: product.id,
          name: product.name,
        }
      }
    }
  } catch (error) {
    console.warn('Failed to search for existing product:', error)
  }
  return null
}

/**
 * Generate a UUID v4 using Node.js built-in crypto module
 * Shopware stores UUIDs as hex strings without dashes
 */
function generateUUID(): string {
  const uuid = randomUUID()
  const hexUuid = uuid.replace(/-/g, '')
  console.log('Generated UUID:', hexUuid)
  return hexUuid
}

/**
 * Get OAuth token for Shopware API
 */
async function getAuthToken(): Promise<string> {
  const appUrl = process.env.APP_URL || 'http://localhost:8000'
  const username = process.env.SHOPWARE_ADMIN_USERNAME || 'admin'
  const password = process.env.SHOPWARE_ADMIN_PASSWORD || 'shopware'

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
  })

  if (!response.ok) {
    throw new Error(`Failed to authenticate: ${response.statusText}`)
  }

  const data = await response.json()
  return data.access_token
}

/**
 * Get or create a basic test product
 */
export async function createBasicProduct(): Promise<Product> {
  const appUrl = process.env.APP_URL || 'http://localhost:8000'
  const token = await getAuthToken()

  // Try to find an existing product first
  const existingProduct = await findExistingProduct(token, appUrl)
  if (existingProduct) {
    return existingProduct
  }

  console.log('No existing product found, creating a new one...')

  // Generate random product name to avoid conflicts
  const randomId = Math.random().toString(36).substring(7)
  const productName = `Test Product ${randomId}`

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
  })

  if (!taxResponse.ok) {
    throw new Error('Failed to fetch tax data')
  }

  const taxData = await taxResponse.json()
  const taxId = taxData.data[0]?.id

  if (!taxId) {
    throw new Error('No tax configuration found')
  }

  // Create the product using the direct API endpoint
  const productId = generateUUID()

  const payload = {
    id: productId,
    name: productName,
    productNumber: `TEST-${randomId}`,
    stock: 10,
    taxId: taxId,
    price: [
      {
        currencyId: 'b7d2554b0ce847cd82f3ac9bd1c0dfca',
        gross: 19.99,
        net: 16.8,
        linked: true,
      },
    ],
  }

  console.log(
    'Creating product with payload:',
    JSON.stringify(payload, null, 2),
  )

  const productResponse = await fetch(`${appUrl}api/product`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!productResponse.ok) {
    const errorText = await productResponse.text()
    console.error('Product creation failed. Status:', productResponse.status)
    console.error('Response:', errorText)
    throw new Error(`Failed to create product: ${errorText}`)
  }

  console.log('Product created successfully. Status:', productResponse.status)

  return {
    id: productId,
    name: productName,
  }
}
