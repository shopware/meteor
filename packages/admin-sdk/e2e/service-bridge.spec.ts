import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import type {} from './testpage/app';

async function setupSiblings(page: Page) {
  await page.goto('http://localhost:8181');
  await page.waitForFunction(() => !!window.serviceBridge);
  await page.evaluate(() => {
    for (const [name, port, location] of [
      ['sender', '8181', 'analytics'],
      ['receiver', '8182', 'copilot-chat'],
      ['other', '8182', 'other-location'],
    ]) {
      const iframe = document.createElement('iframe');
      iframe.name = name;
      iframe.src = `http://localhost:${port}/?location-id=${location}`;
      document.body.appendChild(iframe);
    }
  });
  await expect.poll(() => page.frames().map(frame => frame.name()).filter(Boolean).sort())
    .toEqual(['other', 'receiver', 'sender']);
  const sender = page.frame('sender')!;
  const receiver = page.frame('receiver')!;
  const other = page.frame('other')!;
  await Promise.all([sender, receiver, other].map(frame => frame.waitForFunction(() => !!window.serviceBridge)));
  return { sender, receiver, other };
}

test('bridge is not exposed from the root SDK', async ({ page }) => {
  await page.goto('http://localhost:8181');
  await page.waitForFunction(() => !!window.sw);
  expect(await page.evaluate(() => 'bridge' in window.sw._private)).toBe(false);
});

test('routes a real cross-origin request to the matching sibling and returns its response', async ({ page }) => {
  const { sender, receiver, other } = await setupSiblings(page);
  await receiver.evaluate(() => {
    window.serviceBridge.subscribeServiceEvent('copilot.chat.prompt.v1', async data => {
      document.body.dataset.prompt = (data as { prompt: string }).prompt;
      await Promise.resolve();
      return { status: 'success' };
    }, { allowedOrigins: ['http://localhost:8181'] });
  });
  await other.evaluate(() => {
    window.serviceBridge.subscribeServiceEvent('copilot.chat.prompt.v1', () => {
      document.body.dataset.invoked = 'true';
      return { status: 'error' };
    }, { allowedOrigins: ['http://localhost:8181'] });
  });
  const result = await sender.evaluate(() => window.serviceBridge.publishServiceEvent({
    targetOrigin: 'http://localhost:8182', targetLocationId: 'copilot-chat',
    eventKey: 'copilot.chat.prompt.v1', data: { prompt: 'List the top 10 products by revenue.' },
    options: { timeout: 2000 },
  }));
  expect(result).toEqual({ status: 'success' });
  expect(await receiver.evaluate(() => document.body.dataset.prompt)).toBe('List the top 10 products by revenue.');
  expect(await other.evaluate(() => document.body.dataset.invoked)).toBeUndefined();
});

test('denies a sender outside the receiver allowlist', async ({ page }) => {
  const { sender, receiver } = await setupSiblings(page);
  await receiver.evaluate(() => {
    window.serviceBridge.subscribeServiceEvent('custom.v1', () => {
      document.body.dataset.invoked = 'true';
    }, { allowedOrigins: ['https://untrusted.example.com'] });
  });
  const code = await sender.evaluate(async () => {
    try {
      await window.serviceBridge.publishServiceEvent({
        targetOrigin: 'http://localhost:8182', targetLocationId: 'copilot-chat',
        eventKey: 'custom.v1', data: {}, options: { timeout: 2000 },
      });
    } catch (error) { return (error as { code: string }).code; }
    return 'unexpected-success';
  });
  expect(code).toBe('ORIGIN_NOT_ALLOWED');
  expect(await receiver.evaluate(() => document.body.dataset.invoked)).toBeUndefined();
});

test('times out when no receiving subscription matches', async ({ page }) => {
  const { sender } = await setupSiblings(page);
  const code = await sender.evaluate(async () => {
    try {
      await window.serviceBridge.publishServiceEvent({
        targetOrigin: 'http://localhost:8182', targetLocationId: 'absent',
        eventKey: 'custom.v1', data: {}, options: { timeout: 150 },
      });
    } catch (error) { return (error as { code: string }).code; }
    return 'unexpected-success';
  });
  expect(code).toBe('TIMEOUT');
});

test('resolves business error-shaped payloads without treating them as SDK failures', async ({ page }) => {
  const { sender, receiver } = await setupSiblings(page);
  await receiver.evaluate(() => {
    window.serviceBridge.subscribeServiceEvent('custom.v1', () => ({
      error: { code: 'HANDLER_ERROR', message: 'Business result' },
    }), { allowedOrigins: ['http://localhost:8181'] });
  });
  const result = await sender.evaluate(() => window.serviceBridge.publishServiceEvent({
    targetOrigin: 'http://localhost:8182', targetLocationId: 'copilot-chat',
    eventKey: 'custom.v1', data: {}, options: { timeout: 2000 },
  }));
  expect(result).toEqual({ error: { code: 'HANDLER_ERROR', message: 'Business result' } });
});

test('rejects duplicate registration and allows a replacement after unsubscribe', async ({ page }) => {
  const { sender, receiver } = await setupSiblings(page);
  const code = await receiver.evaluate(() => {
    const { subscribeServiceEvent } = window.serviceBridge;
    const options = { allowedOrigins: ['http://localhost:8181'] };
    const stop = subscribeServiceEvent('custom.v1', () => 'original', options);
    let result = 'unexpected-success';
    try {
      subscribeServiceEvent('custom.v1', () => 'duplicate', options);
    } catch (error) { result = (error as { code: string }).code; }
    stop();
    subscribeServiceEvent('custom.v1', () => 'replacement', options);
    return result;
  });
  expect(code).toBe('DUPLICATE_SUBSCRIPTION');
  const response = await sender.evaluate(() => window.serviceBridge.publishServiceEvent({
    targetOrigin: 'http://localhost:8182', targetLocationId: 'copilot-chat',
    eventKey: 'custom.v1', data: {}, options: { timeout: 2000 },
  }));
  expect(response).toBe('replacement');
});
