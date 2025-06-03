import getCan from './acl';

describe('getCan', () => {
  it('returns true if the crud privilege is granted', async () => {
    const mockGetAppInformation = jest.fn().mockResolvedValue({
      responseType: {
        permissions: {
          read: ['product'],
        },
      },
    });

    const can = getCan(mockGetAppInformation);
    const result = await can('product:read');

    expect(result).toBe(true);
  });

  it('returns false if the crud privilege is not granted', async () => {
    const mockGetAppInformation = jest.fn().mockResolvedValue({
      responseType: {
        permissions: {
          read: ['product'],
        },
      },
    });

    const can = getCan(mockGetAppInformation);
    const result = await can('order:read');

    expect(result).toBe(false);
  });

  it('returns true if the additional privilege is granted', async () => {
    const mockGetAppInformation = jest.fn().mockResolvedValue({
      responseType: {
        permissions: {
          additional: ['api_service_toggle'],
        },
      },
    });

    const can = getCan(mockGetAppInformation);
    const result = await can('api_service_toggle');

    expect(result).toBe(true);
  });

  it('returns false if the additional privilege is not granted', async () => {
    const mockGetAppInformation = jest.fn().mockResolvedValue({
      responseType: {
        permissions: {
          additional: ['system.plugin_maintain']
        },
      },
    });

    const can = getCan(mockGetAppInformation);
    const result = await can('order:read');

    expect(result).toBe(false);
  });
});