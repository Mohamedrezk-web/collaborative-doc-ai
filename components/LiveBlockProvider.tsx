'use client';

import React from 'react';
import { LiveblocksProvider } from '@liveblocks/react/suspense';

function LiveBlockProvider({ children }: { children: React.ReactNode }) {
  return (
    <LiveblocksProvider authEndpoint={'/auth-endpoint'} throttle={16}>
      {children}
    </LiveblocksProvider>
  );
}

export default LiveBlockProvider;
