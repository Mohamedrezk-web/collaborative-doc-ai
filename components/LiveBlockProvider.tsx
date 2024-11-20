'use client';

import React from 'react';
import { LiveblocksProvider } from '@liveblocks/react/suspense';
function LiveBlockProvider({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_LIVEBLOCKES_KEY) {
    throw new Error('NEXT_PUBLIC_LIVEBLOCKES_KEY is not defined');
  }
  return (
    <LiveblocksProvider authEndpoint={'/auth-endpoint'} throttle={16}>
      {children}
    </LiveblocksProvider>
  );
}

export default LiveBlockProvider;
