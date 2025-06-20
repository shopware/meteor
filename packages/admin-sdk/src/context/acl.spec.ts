import createACLHelper from './acl';

describe('createACLHelper', () => {
  it('returns true if the crud privilege is granted', async () => {
    const mockGetAppInformation = jest.fn().mockResolvedValue({
      privileges: {
        read: ['product'],
      },
    });

    const can = createACLHelper(mockGetAppInformation);
    const result = await can('product:read');

    expect(result).toBe(true);
  });

  it('returns false if the crud privilege is not granted', async () => {
    const mockGetAppInformation = jest.fn().mockResolvedValue({
      privileges: {
        read: ['product'],
      },
    });

    const can = createACLHelper(mockGetAppInformation);
    const result = await can('order:read');

    expect(result).toBe(false);
  });

  it('returns true if the additional privilege is granted', async () => {
    const mockGetAppInformation = jest.fn().mockResolvedValue({
      privileges: {
        additional: ['api_service_toggle'],
      },
    });

    const can = createACLHelper(mockGetAppInformation);
    const result = await can('api_service_toggle');

    expect(result).toBe(true);
  });

  it('returns false if the additional privilege is not granted', async () => {
    const mockGetAppInformation = jest.fn().mockResolvedValue({
      privileges: {
        additional: ['system.plugin_maintain']
      },
    });

    const can = createACLHelper(mockGetAppInformation);
    const result = await can('order:read');

    expect(result).toBe(false);
  });
});