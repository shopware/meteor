import { readFileSync } from 'fs';
import { resolve } from 'path';

test('exposes the bridge as an opt-in package subpath', () => {
  const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8'));
  expect(pkg.exports['./es/_private/bridge']).toEqual({
    import: './es/_private/bridge/index.js',
    require: './umd/_private/bridge/index.js',
  });
});
