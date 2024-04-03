export function waitUntil(check: () => any, timeOut = 2500) {
  return new Promise((resolve, reject) => {
    const waitUntilElementLoad = (retryTime = 0) => {
      // do not wait longer than 2.5 seconds
      if (retryTime > 100) {
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
        window.setTimeout(() => waitUntilElementLoad(retryTime + 1), timeOut / 100);
      } else {
        resolve(true);
      }
    };

    waitUntilElementLoad();
  });
}
