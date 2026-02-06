export function waitUntil(check: () => any, timeOut = 2500) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const interval = Math.max(25, Math.floor(timeOut / 100));
    const waitUntilElementLoad = () => {
      if (Date.now() - startTime > timeOut) {
        reject(
          new Error(
            `"waitUntil": condition ${check.toString().replace(/(\r\n|\n|\r)/gm, "")} not met after ${timeOut / 1000} seconds`,
          ),
        );
        return;
      }

      const result = check();

      // retry selection when not found otherwise resolve it
      if (!result) {
        globalThis.setTimeout(waitUntilElementLoad, interval);
      } else {
        resolve(true);
      }
    };

    waitUntilElementLoad();
  });
}
