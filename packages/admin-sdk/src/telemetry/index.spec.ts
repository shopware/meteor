import { dispatch, getSourceExtensionName, trackPageView, trackLinkVisited } from './index';

const mockSend = jest.fn();
jest.mock('../channel', () => ({
  createSender: () => (...args: unknown[]) => mockSend(...args),
}));

describe('telemetry', () => {
  beforeEach(() => {
    mockSend.mockReset();
    mockSend.mockResolvedValue(undefined);
  });

  describe('dispatch', () => {
    it('is a function', () => {
      expect(typeof dispatch).toBe('function');
    });
  });

  describe('trackPageView', () => {
    it('dispatches page_viewed with the correct property names', async () => {
      await trackPageView({
        sw_route_from_href: '/dashboard',
        sw_route_from_name: 'sw.dashboard.index',
        sw_route_to_href: '/products',
        sw_route_to_name: 'sw.product.index',
      });

      expect(mockSend).toHaveBeenCalledWith({
        event: 'page_viewed',
        data: {
          sw_route_from_href: '/dashboard',
          sw_route_from_name: 'sw.dashboard.index',
          sw_route_to_href: '/products',
          sw_route_to_name: 'sw.product.index',
        },
      });
    });

    it('includes sw_route_to_query when provided', async () => {
      await trackPageView({
        sw_route_from_href: '/dashboard',
        sw_route_from_name: null,
        sw_route_to_href: '/products',
        sw_route_to_name: null,
        sw_route_to_query: 'limit=25',
      });

      expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ sw_route_to_query: 'limit=25' }),
      }));
    });
  });

  describe('trackLinkVisited', () => {
    it('dispatches link_visited with href and internal type', async () => {
      await trackLinkVisited({ sw_link_href: '/products', sw_link_type: 'internal' });
      expect(mockSend).toHaveBeenCalledWith({
        event: 'link_visited',
        data: { sw_link_href: '/products', sw_link_type: 'internal' },
      });
    });

    it('dispatches link_visited with external type', async () => {
      await trackLinkVisited({ sw_link_href: 'https://example.com', sw_link_type: 'external' });
      expect(mockSend).toHaveBeenCalledWith({
        event: 'link_visited',
        data: { sw_link_href: 'https://example.com', sw_link_type: 'external' },
      });
    });
  });

  describe('getSourceExtensionName', () => {
    beforeEach(() => {
      window._swsdk = {
        ...window._swsdk,
        adminExtensions: {
          'my-plugin': {
            baseUrl: 'http://my-plugin.localhost',
            permissions: {},
          },
          'another-extension': {
            baseUrl: 'http://another.localhost',
            permissions: {},
          },
        },
      };
    });

    afterEach(() => {
      window._swsdk = {
        ...window._swsdk,
        adminExtensions: {},
      };
    });

    it('returns the technical name for a registered extension origin', () => {
      const name = getSourceExtensionName('http://my-plugin.localhost/some/path');
      expect(name).toBe('my-plugin');
    });

    it('returns the correct name when multiple extensions are registered', () => {
      const name = getSourceExtensionName('http://another.localhost');
      expect(name).toBe('another-extension');
    });

    it('returns undefined for an unknown origin', () => {
      const name = getSourceExtensionName('http://unknown.localhost');
      expect(name).toBeUndefined();
    });

    it('returns undefined for empty string', () => {
      const name = getSourceExtensionName('');
      expect(name).toBeUndefined();
    });

    it('returns undefined for undefined', () => {
      const name = getSourceExtensionName(undefined);
      expect(name).toBeUndefined();
    });

    it('returns undefined when origin matches the admin window and no sourceWindow is given', () => {
      const name = getSourceExtensionName(window.location.origin);
      expect(name).toBeUndefined();
    });

    it('resolves a same-origin extension when sourceWindow href matches a baseUrl prefix', () => {
      window._swsdk.adminExtensions['same-origin-plugin'] = {
        baseUrl: `${window.location.origin}/bundles/same-origin-plugin/`,
        permissions: {},
      };

      const fakeWindow = {
        location: { href: `${window.location.origin}/bundles/same-origin-plugin/index.html` },
      } as Window;

      const name = getSourceExtensionName(window.location.origin, fakeWindow);
      expect(name).toBe('same-origin-plugin');
    });

    it('returns undefined for same-origin when sourceWindow href does not match any baseUrl', () => {
      const fakeWindow = {
        location: { href: `${window.location.origin}/some/other/path` },
      } as Window;

      const name = getSourceExtensionName(window.location.origin, fakeWindow);
      expect(name).toBeUndefined();
    });

    it('does not match an extension whose baseUrl is a string prefix of another extension baseUrl', () => {
      window._swsdk.adminExtensions['plugin'] = {
        baseUrl: `${window.location.origin}/bundles/plugin/`,
        permissions: {},
      };
      window._swsdk.adminExtensions['plugin-extra'] = {
        baseUrl: `${window.location.origin}/bundles/plugin-extra/`,
        permissions: {},
      };

      const fakeWindow = {
        location: { href: `${window.location.origin}/bundles/plugin-extra/index.html` },
      } as Window;

      const name = getSourceExtensionName(window.location.origin, fakeWindow);
      expect(name).toBe('plugin-extra');
    });

    it('resolves when baseUrl is the exact href of the sender window (file URL pattern)', () => {
      window._swsdk.adminExtensions['exact-url-plugin'] = {
        baseUrl: `${window.location.origin}/admin/exact-url-plugin/index.html`,
        permissions: {},
      };

      // The SDK appends ?location-id=... to iframe URLs; we must still resolve correctly.
      const fakeWindow = {
        location: { href: `${window.location.origin}/admin/exact-url-plugin/index.html?location-id=my-location` },
      } as Window;

      const name = getSourceExtensionName(window.location.origin, fakeWindow);
      expect(name).toBe('exact-url-plugin');
    });

    it('resolves a same-origin extension whose baseUrl has no trailing slash', () => {
      window._swsdk.adminExtensions['no-slash-plugin'] = {
        baseUrl: `${window.location.origin}/bundles/no-slash-plugin`,
        permissions: {},
      };

      const fakeWindow = {
        location: { href: `${window.location.origin}/bundles/no-slash-plugin/index.html` },
      } as Window;

      const name = getSourceExtensionName(window.location.origin, fakeWindow);
      expect(name).toBe('no-slash-plugin');
    });

    it('returns the most specific match when baseUrls are nested', () => {
      window._swsdk.adminExtensions['parent-plugin'] = {
        baseUrl: `${window.location.origin}/bundles/parent/`,
        permissions: {},
      };
      window._swsdk.adminExtensions['child-plugin'] = {
        baseUrl: `${window.location.origin}/bundles/parent/child/`,
        permissions: {},
      };

      const fakeWindow = {
        location: { href: `${window.location.origin}/bundles/parent/child/index.html` },
      } as Window;

      const name = getSourceExtensionName(window.location.origin, fakeWindow);
      expect(name).toBe('child-plugin');
    });

    it('does not match an extension on the same host but a different port', () => {
      window._swsdk.adminExtensions['port-plugin'] = {
        baseUrl: 'http://my-plugin.localhost:8080',
        permissions: {},
      };

      const name = getSourceExtensionName('http://my-plugin.localhost:9090');
      expect(name).toBeUndefined();
    });

    it('does not match an extension on the same host but a different scheme', () => {
      const name = getSourceExtensionName('https://my-plugin.localhost');
      expect(name).toBeUndefined();
    });
  });
});
