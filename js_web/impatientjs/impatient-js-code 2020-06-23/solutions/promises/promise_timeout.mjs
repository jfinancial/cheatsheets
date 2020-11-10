export function timeout(ms, promise) {
  return new Promise((resolve, reject) => {
    promise.then(resolve, reject);
    // Works, because Promise doesn’t change
    // after resolution or rejection
    setTimeout(() => {
      reject(new Error(`Timeout after ${ms} ms`));
    }, ms);
  });
}
