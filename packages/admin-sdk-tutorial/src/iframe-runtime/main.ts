import { location, notification, ui } from '@shopware-ag/meteor-admin-sdk';

const root = document.querySelector<HTMLDivElement>('#app');

const params = new URLSearchParams(window.location.search);
let lastRunVersion = 0;

if (root) {
  root.innerHTML = `
    <main style="font-family: Inter, system-ui, sans-serif; padding: 16px; color: #1f2937; background: #fff; min-height: 100vh;">
      <p style="margin: 0 0 8px; color: #64748b; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">Lesson runtime</p>
      <h1 style="margin: 0 0 8px; font-size: 18px;">Real Admin SDK iframe bootstrap</h1>
      <p style="margin: 0 0 16px; line-height: 1.6;">This iframe imports the real Admin SDK package and receives lesson code from the tutorial host.</p>
      <div style="display: grid; gap: 10px;">
        <div style="padding: 12px 14px; border: 1px solid #d8e0eb; border-radius: 12px; background: #f8fafc;">
          <strong style="display:block; margin-bottom: 6px; font-size: 13px;">location-id</strong>
          <span>${params.get('location-id') ?? 'missing'}</span>
        </div>
        <div style="padding: 12px 14px; border: 1px solid #d8e0eb; border-radius: 12px; background: #f8fafc;">
          <strong style="display:block; margin-bottom: 6px; font-size: 13px;">lesson-id</strong>
          <span>${params.get('lesson-id') ?? 'missing'}</span>
        </div>
        <pre id="runtime-code" style="margin: 0; padding: 12px 14px; border: 1px solid #d8e0eb; border-radius: 12px; background: #0f172a; color: #e2e8f0; font: 12px/1.6 SFMono-Regular, Consolas, monospace; white-space: pre-wrap;">Waiting for lesson code…</pre>
      </div>
    </main>
  `;
}

window.parent.postMessage(
  {
    source: 'tutorial-iframe',
    type: 'runtime-ready',
    lessonId: params.get('lesson-id'),
    locationId: params.get('location-id'),
  },
  '*',
);

window.addEventListener('message', (event) => {
  if (typeof event.data !== 'object' || event.data?.source !== 'tutorial-host') {
    return;
  }

  const codeElement = document.querySelector<HTMLElement>('#runtime-code');

  if (codeElement) {
    codeElement.textContent = event.data.code ?? 'No code received';
  }

  if (event.data.runVersion && event.data.runVersion !== lastRunVersion) {
    lastRunVersion = event.data.runVersion;

    void Promise.resolve()
      .then(() => {
        const pendingOperations: Promise<unknown>[] = [];
        const notificationApi = {
          ...notification,
          dispatch(payload: Parameters<typeof notification.dispatch>[0]) {
            window.parent.postMessage(
              {
                source: 'tutorial-iframe',
                type: 'notification-intent',
                lessonId: event.data.lessonId,
                runVersion: event.data.runVersion,
                payload,
              },
              '*',
            );

            const request = notification.dispatch(payload);

            pendingOperations.push(request);

            return request;
          },
        };
        const uiApi = {
          ...ui,
          componentSection: {
            ...ui.componentSection,
            add(payload: Parameters<typeof ui.componentSection.add>[0]) {
              window.parent.postMessage(
                {
                  source: 'tutorial-iframe',
                  type: 'component-section-intent',
                  lessonId: event.data.lessonId,
                  runVersion: event.data.runVersion,
                  payload,
                },
                '*',
              );

              const request = ui.componentSection.add(payload);

              pendingOperations.push(request);

              return request;
            },
          },
          menu: {
            ...ui.menu,
            addMenuItem(payload: Parameters<typeof ui.menu.addMenuItem>[0]) {
              window.parent.postMessage(
                {
                  source: 'tutorial-iframe',
                  type: 'menu-intent',
                  lessonId: event.data.lessonId,
                  runVersion: event.data.runVersion,
                  payload,
                },
                '*',
              );

              const request = ui.menu.addMenuItem(payload);

              pendingOperations.push(request);

              return request;
            },
          },
        };

        const executor = new Function(
          'notification',
          'ui',
          'location',
          `return (async () => {
${event.data.runCode ?? event.data.code}
})();`,
        ) as (
          notificationApi: typeof notification,
          uiApi: typeof ui,
          locationApi: typeof location,
        ) => Promise<void>;

        return executor(notificationApi, uiApi, location).then(async () => {
          await Promise.allSettled(pendingOperations);
        });
      })
      .then(() => {
        window.parent.postMessage(
          {
            source: 'tutorial-iframe',
            type: 'run-success',
            lessonId: event.data.lessonId,
            runVersion: event.data.runVersion,
          },
          '*',
        );
      })
      .catch((error: unknown) => {
        window.parent.postMessage(
          {
            source: 'tutorial-iframe',
            type: 'run-error',
            lessonId: event.data.lessonId,
            runVersion: event.data.runVersion,
            error: error instanceof Error ? error.message : 'Unknown iframe runtime error',
          },
          '*',
        );
      });
  }

  window.parent.postMessage(
    {
      source: 'tutorial-iframe',
      type: 'code-received',
      lessonId: event.data.lessonId,
      locationId: event.data.locationId,
    },
    '*',
  );
});
