import React from 'react';
import classNames from 'classnames';
import useReactTooltip from '../hooks/useReactTooltip';

export default function Button({ tooltip, className, children, ...others }) {
  useReactTooltip();

  return (
    <div
      className={classNames(
        'button-wrapper flex justify-center items-center',
        className,
      )}
      {...others}
    >
      <div
        className="button flex justify-center items-center"
        data-tip={tooltip || undefined}
        data-place="left"
      >
        {children}
      </div>
    </div>
  );
}
