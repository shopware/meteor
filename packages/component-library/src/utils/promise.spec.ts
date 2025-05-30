import { isPromise } from './promise';

describe('utils/promise', () => {
  describe('isPromise', () => {
    it('should return true for a Promise', () => {
      const promise = new Promise<void>((resolve) => {
        resolve();
      });

      expect(isPromise(promise)).toBe(true);
    });

    it('should return true for a Promise created with Promise.resolve', () => {
      const promise = Promise.resolve('test');

      expect(isPromise(promise)).toBe(true);
    });

    it('should return true for a Promise created with Promise.reject (when caught)', () => {
      const promise = Promise.reject('error').catch(() => {});

      expect(isPromise(promise)).toBe(true);
    });

    it('should return false for null', () => {
      expect(isPromise(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isPromise(undefined)).toBe(false);
    });

    it('should return false for a string', () => {
      expect(isPromise('string')).toBe(false);
    });

    it('should return false for a number', () => {
      expect(isPromise(123)).toBe(false);
    });

    it('should return false for a boolean', () => {
      expect(isPromise(true)).toBe(false);
    });

    it('should return false for a regular object', () => {
      const obj = { key: 'value' };

      expect(isPromise(obj)).toBe(false);
    });

    it('should return false for an object with only a then method', () => {
      const thennable = {
        then: () => {}
      };

      expect(isPromise(thennable)).toBe(false);
    });

    it('should return false for an object with non-function then and catch properties', () => {
      const obj = {
        then: 'not a function',
        catch: 'not a function'
      };

      expect(isPromise(obj)).toBe(false);
    });

    it('should return false for an object with then and catch methods that aren\'t functions', () => {
      const obj = {
        then: 123,
        catch: true
      };

      expect(isPromise(obj)).toBe(false);
    });
  });
});
