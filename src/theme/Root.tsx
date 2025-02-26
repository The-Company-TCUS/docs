import React from 'react';
import { CursorEffectProvider } from '@site/src/context/CursorEffectProvider';
import { QueryProvider } from '@site/src/context/QueryProvider';
// eslint-disable-next-line import/no-unresolved
import 'windi-components.css';
// eslint-disable-next-line import/no-unresolved
import 'windi-utilities.css';

// Default implementation, that you can customize
export default function Root({ children }: { children?: React.ReactNode }) {
  return (
    <QueryProvider>
      <CursorEffectProvider>{children}</CursorEffectProvider>
    </QueryProvider>
  );
}
