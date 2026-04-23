import '#admin-sdk-channel';

import { ref } from 'vue';

export function createTutorialHostRuntime(options: { getAllowedSource: () => Window | null }) {
  const iframeStatus = ref('Booting runtime iframe…');
  const lastSdkMessageType = ref('No SDK message yet');
  const registeredSourceCount = ref(0);

  function syncRegisteredSourceCount() {
    registeredSourceCount.value = (window as typeof window & {
      _swsdk?: { sourceRegistry?: Set<unknown> };
    })._swsdk?.sourceRegistry?.size ?? 0;
  }

  function isAllowedSource(source: MessageEvent['source']) {
    const allowedSource = options.getAllowedSource();

    if (!allowedSource) {
      return true;
    }

    return source === allowedSource;
  }

  function handleMessage(event: MessageEvent) {
    if (!isAllowedSource(event.source)) {
      return;
    }

    if (typeof event.data === 'object' && event.data?.source === 'tutorial-iframe') {
      if (event.data.type === 'runtime-ready') {
        iframeStatus.value = 'Runtime iframe ready';
      }

      if (event.data.type === 'code-received') {
        iframeStatus.value = `Runtime synced for ${event.data.lessonId}`;
      }

      return;
    }

    if (typeof event.data !== 'string') {
      return;
    }

    try {
      const parsed = JSON.parse(event.data) as { _type?: string };

      if (!parsed._type) {
        return;
      }

      lastSdkMessageType.value = parsed._type;

      if (parsed._type === '__registerWindow__') {
        iframeStatus.value = 'Real Admin SDK connected to parent';
        syncRegisteredSourceCount();
      }
    } catch {
      // ignore non-SDK messages
    }
  }

  function start() {
    syncRegisteredSourceCount();
    window.addEventListener('message', handleMessage);
  }

  function stop() {
    window.removeEventListener('message', handleMessage);
  }

  return {
    iframeStatus,
    lastSdkMessageType,
    registeredSourceCount,
    start,
    stop,
    syncRegisteredSourceCount,
  };
}
