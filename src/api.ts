export function fakeCheckoutApi(): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() > 0.3;

      if (success) {
        resolve();
      } else {
        reject(new Error("Payment failed"));
      }
    }, 1500);
  });
}
