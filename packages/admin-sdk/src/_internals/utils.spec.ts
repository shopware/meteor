import { getLocationId, getColorScheme } from './utils';

describe('utils', () => {
  const initialUrl = window.location.href;

  afterEach(() => {
    window.history.replaceState({}, '', initialUrl);
  });

  describe('getLocationId', () => {
    it('returns the location-id search param', () => {
      window.history.replaceState({}, '', '?location-id=my-location');

      expect(getLocationId()).toBe('my-location');
    });

    it('returns null without a location-id search param', () => {
      expect(getLocationId()).toBeNull();
    });
  });

  describe('getColorScheme', () => {
    it('returns the color-scheme search param', () => {
      window.history.replaceState({}, '', '?location-id=my-location&color-scheme=dark');

      expect(getColorScheme()).toBe('dark');
    });

    it('returns null without a color-scheme search param', () => {
      expect(getColorScheme()).toBeNull();
    });
  });
});
