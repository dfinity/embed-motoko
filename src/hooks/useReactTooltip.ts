import { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

// let timeout: NodeJS.Timeout | undefined;

export default function useReactTooltip(): typeof ReactTooltip {
  // if (timeout === undefined) {
  //   timeout = setTimeout(() => {
  //     timeout = undefined;
  //     ReactTooltip.rebuild();
  //   });
  // }

  useEffect(() => {
    return () => {
      setTimeout(() => {
        ReactTooltip.rebuild();
      });
    };
  });

  return ReactTooltip;
}
