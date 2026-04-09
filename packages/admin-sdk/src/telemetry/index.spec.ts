import { dispatch, getSourceExtensionName } from './index';

describe('telemetry', () => {
  describe('dispatch', () => {
    it('is a function', () => {
      expect(typeof dispatch).toBe('function');
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

    it('returns undefined when origin matches the admin window (same origin)', () => {
      const name = getSourceExtensionName(window.location.origin);
      expect(name).toBeUndefined();
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
