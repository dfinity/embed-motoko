import { useEffect } from 'react';

export default function useTimeout(
  ...args: [callback: (args: void) => void, ms?: number]
) {
  useEffect(() => {
    const id = setTimeout(...args);
    return () => clearTimeout(id);
  });
}
