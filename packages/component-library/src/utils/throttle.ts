export function throttle<T extends (...args: any[]) => void>(
  func: T,
  timeFrame: number,
): (...args: Parameters<T>) => void {
  let lastTime = 0;

  return function (this: any, ...args: Parameters<T>) {
    const now = new Date();
    if (now.getTime() - lastTime >= timeFrame) {
      func.apply(this, args);
      lastTime = now.getTime();
    }
  };
}
